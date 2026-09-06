// FILE: frontend/src/lib/max-sdk.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Read MAX mini-app init data and exchange it for a session.
//   SCOPE: Window WebApp bridge lookup, initData read, MAX login exchange
//   DEPENDS: none
//   LINKS: M-FRONTEND-MAX V-M-FRONTEND-MAX
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   getMaxInitData - return MAX WebApp initData or null outside the client
//   isMaxClient - detect presence of the MAX WebApp bridge
//   waitForMaxInitData - wait briefly for MAX initData after mount
//   initMax - signal the MAX WebApp ready
//   maxLogin - exchange MAX initData for internal_jwt
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.1.0 - Added MAX login exchange and client helpers for platform login variants]
// END_CHANGE_SUMMARY

declare global {
  interface Window {
    WebApp?: {
      initData: string;
      ready?: () => void;
      // ... и другие методы из документации
    };
  }
}

function getMaxWebApp(): Window['WebApp'] {
  return typeof window !== 'undefined' ? window.WebApp : undefined;
}

/** Сообщает MAX, что приложение готово. Безопасен вне клиента (no-op). */
// START_CONTRACT: initMax
//   PURPOSE: Signal MAX WebApp ready when the bridge is present
//   INPUTS: { none }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: calls MAX WebApp ready when present
//   LINKS: M-FRONTEND-MAX
// END_CONTRACT: initMax
export function initMax(): void {
  try {
    getMaxWebApp()?.ready?.();
  } catch (e) {
    console.warn('MAX WebApp init failed:', e);
  }
}

/** Присутствует ли MAX WebApp bridge (приложение открыто из MAX-клиента). */
// START_CONTRACT: isMaxClient
//   PURPOSE: Detect presence of the MAX WebApp bridge on window
//   INPUTS: { none }
//   OUTPUTS: { boolean }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-MAX
// END_CONTRACT: isMaxClient
export function isMaxClient(): boolean {
  return typeof window !== 'undefined' && !!window.WebApp;
}

/**
 * Ждёт появления MAX initData (bridge может инициализироваться чуть позже
 * монтирования React). Возвращает initData или null. Вне MAX-клиента не ждёт.
 */
// START_CONTRACT: waitForMaxInitData
//   PURPOSE: Wait briefly for MAX initData after mount
//   INPUTS: { timeoutMs: number - max wait, default 2500 }
//   OUTPUTS: { Promise<string | null> - initData or null }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-MAX fn-getMaxInitData
// END_CONTRACT: waitForMaxInitData
export async function waitForMaxInitData(
  timeoutMs = 2500,
): Promise<string | null> {
  const existing = getMaxInitData();
  if (existing) return existing;
  if (!isMaxClient()) return null;
  const step = 100;
  let waited = 0;
  while (waited < timeoutMs) {
    await new Promise((r) => setTimeout(r, step));
    waited += step;
    const d = getMaxInitData();
    if (d) return d;
  }
  return getMaxInitData();
}

/**
 * Авто-логин через MAX: отправляет initData на бэкенд,
 * сохраняет внутренний JWT в localStorage. Возвращает true при успехе.
 */
// START_CONTRACT: maxLogin
//   PURPOSE: Exchange MAX initData for an internal JWT
//   INPUTS: { none }
//   OUTPUTS: { Promise<boolean> - true when accessToken is stored }
//   SIDE_EFFECTS: POSTs /auth/max-login and writes internal_jwt
//   LINKS: M-FRONTEND-MAX fn-maxLogin M-FRONTEND-AUTH
// END_CONTRACT: maxLogin
export async function maxLogin(): Promise<boolean> {
  // START_BLOCK_MAX_LOGIN
  const initData = getMaxInitData();
  if (!initData) return false;

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    console.error('VITE_API_BASE_URL is not set; cannot perform MAX login');
    return false;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/auth/max-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    });

    if (!response.ok) {
      console.error('MAX login failed:', response.status);
      return false;
    }

    const { accessToken } = await response.json();
    if (!accessToken) return false;

    localStorage.setItem('internal_jwt', accessToken);
    return true;
  } catch (e) {
    console.error('MAX login error:', e);
    return false;
  }
  // END_BLOCK_MAX_LOGIN
}

/**
 * Возвращает `initData` от MAX Bridge.
 * Вне клиента MAX возвращает null (или моковые данные для отладки).
 */
// START_CONTRACT: getMaxInitData
//   PURPOSE: Read MAX WebApp init payload from window.WebApp
//   INPUTS: { none }
//   OUTPUTS: { string | null - initData when the MAX bridge is present }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-MAX fn-getMaxInitData V-M-FRONTEND-MAX
// END_CONTRACT: getMaxInitData
export function getMaxInitData(): string | null {
  // START_BLOCK_READ_MAX_INIT
  if (typeof window !== 'undefined' && window.WebApp?.initData) {
    return window.WebApp.initData;
  }
  
  // Для отладки в браузере: можно сгенерировать строку на бэкенде и вставить сюда
  // console.warn('MAX WebApp SDK not found. Returning null.');
  return null; 
  // END_BLOCK_READ_MAX_INIT
}
