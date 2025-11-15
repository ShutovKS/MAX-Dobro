// src/lib/max-sdk.ts

// Объявляем глобальный объект, чтобы TypeScript не ругался
declare global {
  interface Window {
    WebApp?: {
      initData: string;
      ready: () => void;
      // ... и другие методы из документации
    };
  }
}

/**
 * Возвращает `initData` от MAX Bridge.
 * Вне клиента MAX возвращает null (или моковые данные для отладки).
 */
export function getMaxInitData(): string | null {
  if (typeof window !== 'undefined' && window.WebApp?.initData) {
    return window.WebApp.initData;
  }
  
  // Для отладки в браузере: можно сгенерировать строку на бэкенде и вставить сюда
  // console.warn('MAX WebApp SDK not found. Returning null.');
  return null; 
}