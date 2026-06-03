// src/lib/telegram-sdk.ts
// Интеграция с Telegram Mini App (Telegram WebApp SDK подключён в index.html).

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
export function initTelegram(): void {
  const webApp = getWebApp();
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
  const initData = getWebApp()?.initData;
  return initData && initData.length > 0 ? initData : null;
}

/** Запущены ли мы внутри Telegram (есть валидная initData). */
export function isTelegramEnv(): boolean {
  return getTelegramInitData() !== null;
}

/** Присутствует ли Telegram WebApp SDK (т.е. приложение открыто из Telegram-клиента). */
export function isTelegramClient(): boolean {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
}

/**
 * Ждёт появления initData (SDK может инициализироваться чуть позже монтирования
 * React). Возвращает initData или null. Вне Telegram-клиента не ждёт.
 */
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

// ───────────────────────────────────────────────────────────────────────────
// Telegram WebApp возможности (share / ссылки / файлы / тактильный отклик).
// Каждый хелпер деградирует в обычный веб, если мы вне Telegram-клиента —
// чтобы приложение работало и при открытии сайта в браузере.
// ───────────────────────────────────────────────────────────────────────────

/** Текущий Telegram-пользователь из initDataUnsafe (или null вне Telegram). */
export function tgGetUser(): TelegramUser | null {
  return getWebApp()?.initDataUnsafe?.user ?? null;
}

/** start_param из deep-link `t.me/<bot>?startapp=<param>` (или null). */
export function tgGetStartParam(): string | null {
  return getWebApp()?.initDataUnsafe?.start_param ?? null;
}

/**
 * Deep-link, открывающий наше Mini App с параметром старта.
 * ВАЖНО: ссылка вида `?startapp` без значения НЕ заполняет start_param —
 * нужно `?startapp=<param>`. Параметр допускает [A-Za-z0-9_-], поэтому
 * используем разделитель `_`: `event_42`, `course_3`, `ref_1001`.
 */
export function buildDeepLink(kind: string, id: string | number): string {
  return `https://t.me/${TELEGRAM_BOT_USERNAME}?startapp=${kind}_${id}`;
}

/** Открыть произвольную t.me-ссылку внутри Telegram (или новой вкладкой вне его). */
export function tgOpenTelegramLink(url: string): void {
  const webApp = getWebApp();
  if (webApp?.openTelegramLink) {
    webApp.openTelegramLink(url);
  } else if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/** Открыть внешнюю ссылку (сайт организации и т.п.). */
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
export function tgApplyHeaderColor(color: string): void {
  try {
    getWebApp()?.setHeaderColor?.(color);
  } catch {
    /* no-op */
  }
}

/** Низкоуровневый доступ к нативным кнопкам (для хуков MainButton/BackButton). */
export function getTelegramMainButton(): BottomButton | undefined {
  return getWebApp()?.MainButton;
}
export function getTelegramBackButton() {
  return getWebApp()?.BackButton;
}
