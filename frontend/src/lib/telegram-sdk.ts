// FILE: frontend/src/lib/telegram-sdk.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Wrap Telegram Mini App init data, deep links, and native UI helpers.
//   SCOPE: WebApp init, login exchange, share/open/download, haptics, native buttons
//   DEPENDS: M-FRONTEND-AUTH
//   LINKS: M-FRONTEND-TELEGRAM V-M-FRONTEND-TELEGRAM M-FRONTEND-AUTH
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   initTelegram - ready/expand WebApp and apply light chrome
//   getTelegramInitData - read initData or null outside Telegram
//   telegramLogin - exchange initData for internal_jwt
//   tgGetStartParam - read startapp deep-link param
//   buildDeepLink - t.me startapp URL for a kind/id pair
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { TELEGRAM_BOT_USERNAME } from './constants';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

interface HapticFeedback {
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  selectionChanged: () => void;
}

interface BottomButton {
  setText: (text: string) => void;
  show: () => void;
  hide: () => void;
  enable: () => void;
  disable: () => void;
  showProgress: (leaveActive?: boolean) => void;
  hideProgress: () => void;
  onClick: (cb: () => void) => void;
  offClick: (cb: () => void) => void;
  isVisible: boolean;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: {
    user?: TelegramUser;
    start_param?: string;
  };
  version: string;
  platform: string;
  colorScheme?: 'light' | 'dark';
  themeParams?: Record<string, string>;
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  downloadFile?: (params: { url: string; file_name: string }) => void;
  shareToStory?: (mediaUrl: string, params?: { text?: string; widget_link?: { url: string; name?: string } }) => void;
  isVersionAtLeast?: (version: string) => boolean;
  HapticFeedback?: HapticFeedback;
  MainButton?: BottomButton;
  BackButton?: { show: () => void; hide: () => void; onClick: (cb: () => void) => void; offClick: (cb: () => void) => void; isVisible: boolean };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

function getWebApp(): TelegramWebApp | undefined {
  return typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;
}

/** Сообщает Telegram, что приложение готово, и разворачивает его на весь экран. */
// START_CONTRACT: initTelegram
//   PURPOSE: Signal WebApp ready, expand, and apply light header/background
//   INPUTS: { none }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: calls Telegram WebApp ready/expand/color setters when present
//   LINKS: M-FRONTEND-TELEGRAM fn-initTelegram
// END_CONTRACT: initTelegram
export function initTelegram(): void {
  const webApp = getWebApp();
  if (!webApp) return;
  try {
    webApp.ready();
    webApp.expand();
    // Светлая тема приложения: белая шапка/фон под наши экраны.
    webApp.setHeaderColor?.('#ffffff');
    webApp.setBackgroundColor?.('#ffffff');
  } catch (e) {
    console.warn('Telegram WebApp init failed:', e);
  }
}

/** Возвращает `initData` от Telegram WebApp или null (вне Telegram). */
// START_CONTRACT: getTelegramInitData
//   PURPOSE: Read Telegram WebApp initData
//   INPUTS: { none }
//   OUTPUTS: { string | null - initData when present }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-TELEGRAM
// END_CONTRACT: getTelegramInitData
export function getTelegramInitData(): string | null {
  // START_BLOCK_READ_INIT_DATA
  const initData = getWebApp()?.initData;
  return initData && initData.length > 0 ? initData : null;
  // END_BLOCK_READ_INIT_DATA
}

/** Запущены ли мы внутри Telegram (есть валидная initData). */
// START_CONTRACT: isTelegramEnv
//   PURPOSE: Detect a Telegram session with valid initData
//   INPUTS: { none }
//   OUTPUTS: { boolean }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-TELEGRAM fn-getTelegramInitData
// END_CONTRACT: isTelegramEnv
export function isTelegramEnv(): boolean {
  return getTelegramInitData() !== null;
}

/** Присутствует ли Telegram WebApp SDK (т.е. приложение открыто из Telegram-клиента). */
// START_CONTRACT: isTelegramClient
//   PURPOSE: Detect presence of the Telegram WebApp SDK on window
//   INPUTS: { none }
//   OUTPUTS: { boolean }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-TELEGRAM
// END_CONTRACT: isTelegramClient
export function isTelegramClient(): boolean {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
}

/**
 * Ждёт появления initData (SDK может инициализироваться чуть позже монтирования
 * React). Возвращает initData или null. Вне Telegram-клиента не ждёт.
 */
// START_CONTRACT: waitForTelegramInitData
//   PURPOSE: Wait briefly for Telegram initData after mount
//   INPUTS: { timeoutMs: number - max wait, default 2500 }
//   OUTPUTS: { Promise<string | null> - initData or null }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-TELEGRAM fn-getTelegramInitData
// END_CONTRACT: waitForTelegramInitData
export async function waitForTelegramInitData(
  timeoutMs = 2500,
): Promise<string | null> {
  const existing = getTelegramInitData();
  if (existing) return existing;
  if (!isTelegramClient()) return null;
  const step = 100;
  let waited = 0;
  while (waited < timeoutMs) {
    await new Promise((r) => setTimeout(r, step));
    waited += step;
    const d = getTelegramInitData();
    if (d) return d;
  }
  return getTelegramInitData();
}

/**
 * Авто-логин через Telegram: отправляет initData на бэкенд,
 * сохраняет внутренний JWT в localStorage. Возвращает true при успехе.
 */
// START_CONTRACT: telegramLogin
//   PURPOSE: Exchange Telegram initData for an internal JWT
//   INPUTS: { none }
//   OUTPUTS: { Promise<boolean> - true when accessToken is stored }
//   SIDE_EFFECTS: POSTs /auth/telegram-login and writes internal_jwt
//   LINKS: M-FRONTEND-TELEGRAM fn-telegramLogin M-FRONTEND-AUTH
// END_CONTRACT: telegramLogin
export async function telegramLogin(): Promise<boolean> {
  // START_BLOCK_TELEGRAM_LOGIN
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
  // END_BLOCK_TELEGRAM_LOGIN
}

// ───────────────────────────────────────────────────────────────────────────
// Telegram WebApp возможности (share / ссылки / файлы / тактильный отклик).
// Каждый хелпер деградирует в обычный веб, если мы вне Telegram-клиента —
// чтобы приложение работало и при открытии сайта в браузере.
// ───────────────────────────────────────────────────────────────────────────

/** Текущий Telegram-пользователь из initDataUnsafe (или null вне Telegram). */
// START_CONTRACT: tgGetUser
//   PURPOSE: Read the Telegram user from initDataUnsafe
//   INPUTS: { none }
//   OUTPUTS: { TelegramUser | null }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-TELEGRAM
// END_CONTRACT: tgGetUser
export function tgGetUser(): TelegramUser | null {
  return getWebApp()?.initDataUnsafe?.user ?? null;
}

/** start_param из deep-link `t.me/<bot>?startapp=<param>` (или null). */
// START_CONTRACT: tgGetStartParam
//   PURPOSE: Read the startapp deep-link param from WebApp or location hash
//   INPUTS: { none }
//   OUTPUTS: { string | null }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-TELEGRAM fn-tgGetStartParam
// END_CONTRACT: tgGetStartParam
export function tgGetStartParam(): string | null {
  // START_BLOCK_READ_START_PARAM
  const wa = getWebApp();
  const fromUnsafe = wa?.initDataUnsafe?.start_param;
  if (fromUnsafe) return fromUnsafe;
  // Фолбэк: некоторые версии/платформы не кладут start_param в initDataUnsafe —
  // парсим из самой строки initData.
  if (wa?.initData) {
    const sp = new URLSearchParams(wa.initData).get('start_param');
    if (sp) return sp;
  }
  // Фолбэк для веба: tgWebAppStartParam в hash страницы.
  if (typeof window !== 'undefined' && window.location.hash) {
    const sp = new URLSearchParams(
      window.location.hash.replace(/^#/, ''),
    ).get('tgWebAppStartParam');
    if (sp) return sp;
  }
  return null;
  // END_BLOCK_READ_START_PARAM
}

/**
 * Deep-link, открывающий наше Mini App с параметром старта.
 * ВАЖНО: ссылка вида `?startapp` без значения НЕ заполняет start_param —
 * нужно `?startapp=<param>`. Параметр допускает [A-Za-z0-9_-], поэтому
 * используем разделитель `_`: `event_42`, `course_3`, `ref_1001`.
 */
// START_CONTRACT: buildDeepLink
//   PURPOSE: Build a t.me startapp deep-link for a kind/id pair
//   INPUTS: { kind: string - entity kind; id: string | number - entity id }
//   OUTPUTS: { string - https://t.me/<bot>?startapp=<kind>_<id> }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-TELEGRAM
// END_CONTRACT: buildDeepLink
export function buildDeepLink(kind: string, id: string | number): string {
  return `https://t.me/${TELEGRAM_BOT_USERNAME}?startapp=${kind}_${id}`;
}

/** Открыть произвольную t.me-ссылку внутри Telegram (или новой вкладкой вне его). */
// START_CONTRACT: tgOpenTelegramLink
//   PURPOSE: Open a t.me URL inside Telegram or a new browser tab
//   INPUTS: { url: string - t.me or share URL }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: opens Telegram or a browser window
//   LINKS: M-FRONTEND-TELEGRAM
// END_CONTRACT: tgOpenTelegramLink
export function tgOpenTelegramLink(url: string): void {
  const webApp = getWebApp();
  if (webApp?.openTelegramLink) {
    webApp.openTelegramLink(url);
  } else if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/** Открыть внешнюю ссылку (сайт организации и т.п.). */
// START_CONTRACT: tgOpenLink
//   PURPOSE: Open an external URL via Telegram or a new browser tab
//   INPUTS: { url: string - external URL }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: opens Telegram openLink or a browser window
//   LINKS: M-FRONTEND-TELEGRAM
// END_CONTRACT: tgOpenLink
export function tgOpenLink(url: string): void {
  const webApp = getWebApp();
  if (webApp?.openLink) {
    webApp.openLink(url);
  } else if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Поделиться ссылкой через Telegram (нативный выбор чата).
 * Вне Telegram — копируем/открываем share-страницу t.me.
 */
// START_CONTRACT: tgShareUrl
//   PURPOSE: Share a URL through Telegram share-url
//   INPUTS: { url: string - shared URL; text: string - optional share text }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: opens Telegram share UI or a t.me share tab
//   LINKS: M-FRONTEND-TELEGRAM fn-tgOpenTelegramLink
// END_CONTRACT: tgShareUrl
export function tgShareUrl(url: string, text = ''): void {
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    url,
  )}&text=${encodeURIComponent(text)}`;
  tgOpenTelegramLink(shareUrl);
}

/**
 * Скачать файл по URL (Bot API 8.0+). Вне поддержки — обычный якорь-скачивание.
 * Поддерживает data:-URL (клиентски сгенерированный PDF/картинка).
 */
// START_CONTRACT: tgDownloadFile
//   PURPOSE: Download a file via Telegram or a fallback anchor click
//   INPUTS: { params: { url: string; file_name: string } }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: triggers Telegram downloadFile or a DOM download click
//   LINKS: M-FRONTEND-TELEGRAM
// END_CONTRACT: tgDownloadFile
export function tgDownloadFile(params: { url: string; file_name: string }): void {
  const webApp = getWebApp();
  const supportsNative =
    !!webApp?.downloadFile &&
    !!webApp?.isVersionAtLeast &&
    webApp.isVersionAtLeast('8.0') &&
    !params.url.startsWith('data:'); // downloadFile не принимает data:-URL
  if (supportsNative) {
    webApp!.downloadFile!({ url: params.url, file_name: params.file_name });
    return;
  }
  if (typeof document !== 'undefined') {
    const a = document.createElement('a');
    a.href = params.url;
    a.download = params.file_name;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/** Поделиться в Stories (Bot API 8.0+); тихо игнорируется вне поддержки. */
// START_CONTRACT: tgShareToStory
//   PURPOSE: Share media to Telegram Stories or fall back to URL share
//   INPUTS: { mediaUrl: string; params?: { text, widgetUrl, widgetName } }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: calls shareToStory or tgShareUrl
//   LINKS: M-FRONTEND-TELEGRAM fn-tgShareUrl
// END_CONTRACT: tgShareToStory
export function tgShareToStory(
  mediaUrl: string,
  params?: { text?: string; widgetUrl?: string; widgetName?: string },
): void {
  const webApp = getWebApp();
  if (webApp?.shareToStory && webApp.isVersionAtLeast?.('8.0')) {
    webApp.shareToStory(mediaUrl, {
      text: params?.text,
      widget_link: params?.widgetUrl
        ? { url: params.widgetUrl, name: params.widgetName }
        : undefined,
    });
  } else if (params?.widgetUrl) {
    tgShareUrl(params.widgetUrl, params?.text ?? '');
  }
}

type HapticImpact = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type HapticNotification = 'error' | 'success' | 'warning';

/** Тактильный отклик. Безопасен вне Telegram (no-op). */
export const tgHaptic = {
  impact(style: HapticImpact = 'light'): void {
    try {
      getWebApp()?.HapticFeedback?.impactOccurred(style);
    } catch {
      /* no-op */
    }
  },
  notification(type: HapticNotification): void {
    try {
      getWebApp()?.HapticFeedback?.notificationOccurred(type);
    } catch {
      /* no-op */
    }
  },
  selection(): void {
    try {
      getWebApp()?.HapticFeedback?.selectionChanged();
    } catch {
      /* no-op */
    }
  },
};

/** Применяет цвет шапки Telegram (тема остаётся светлой по решению D12). */
// START_CONTRACT: tgApplyHeaderColor
//   PURPOSE: Set Telegram header color when the WebApp API is present
//   INPUTS: { color: string - CSS color }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: calls setHeaderColor
//   LINKS: M-FRONTEND-TELEGRAM
// END_CONTRACT: tgApplyHeaderColor
export function tgApplyHeaderColor(color: string): void {
  try {
    getWebApp()?.setHeaderColor?.(color);
  } catch {
    /* no-op */
  }
}

/** Низкоуровневый доступ к нативным кнопкам (для хуков MainButton/BackButton). */
// START_CONTRACT: getTelegramMainButton
//   PURPOSE: Return Telegram MainButton for native UI hooks
//   INPUTS: { none }
//   OUTPUTS: { BottomButton | undefined }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-TELEGRAM
// END_CONTRACT: getTelegramMainButton
export function getTelegramMainButton(): BottomButton | undefined {
  return getWebApp()?.MainButton;
}
// START_CONTRACT: getTelegramBackButton
//   PURPOSE: Return Telegram BackButton for native UI hooks
//   INPUTS: { none }
//   OUTPUTS: { BackButton | undefined }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-TELEGRAM
// END_CONTRACT: getTelegramBackButton
export function getTelegramBackButton() {
  return getWebApp()?.BackButton;
}
