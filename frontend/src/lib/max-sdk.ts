// FILE: frontend/src/lib/max-sdk.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Read MAX mini-app init data for MAX login.
//   SCOPE: Window WebApp bridge lookup and initData read
//   DEPENDS: none
//   LINKS: M-FRONTEND-MAX V-M-FRONTEND-MAX
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   getMaxInitData - return MAX WebApp initData or null outside the client
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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
