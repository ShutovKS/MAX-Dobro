// src/lib/telegram-sdk.ts
// Интеграция с Telegram Mini App (Telegram WebApp SDK подключён в index.html).

interface TelegramWebApp {
  initData: string;
  ready: () => void;
  expand: () => void;
  setHeaderColor?: (color: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

/** Сообщает Telegram, что приложение готово, и разворачивает его на весь экран. */
export function initTelegram(): void {
  const webApp = window.Telegram?.WebApp;
  if (!webApp) return;
  try {
    webApp.ready();
    webApp.expand();
  } catch (e) {
    console.warn('Telegram WebApp init failed:', e);
  }
}

/** Возвращает `initData` от Telegram WebApp или null (вне Telegram). */
export function getTelegramInitData(): string | null {
  const initData = window.Telegram?.WebApp?.initData;
  return initData && initData.length > 0 ? initData : null;
}

/** Запущены ли мы внутри Telegram (есть валидная initData). */
export function isTelegramEnv(): boolean {
  return getTelegramInitData() !== null;
}

/**
 * Авто-логин через Telegram: отправляет initData на бэкенд,
 * сохраняет внутренний JWT в localStorage. Возвращает true при успехе.
 */
export async function telegramLogin(): Promise<boolean> {
  const initData = getTelegramInitData();
  if (!initData) return false;

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    console.error('VITE_API_BASE_URL is not set; cannot perform Telegram login');
    return false;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/auth/telegram-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    });

    if (!response.ok) {
      console.error('Telegram login failed:', response.status);
      return false;
    }

    const { accessToken } = await response.json();
    if (!accessToken) return false;

    localStorage.setItem('internal_jwt', accessToken);
    return true;
  } catch (e) {
    console.error('Telegram login error:', e);
    return false;
  }
}
