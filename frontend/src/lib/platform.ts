// FILE: frontend/src/lib/platform.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Detect whether the mini-app runs inside Telegram, MAX, or plain web.
//   SCOPE: Messenger initData checks plus ?platform override for demo preview
//   DEPENDS: M-FRONTEND-TELEGRAM, M-FRONTEND-MAX
//   LINKS: M-FRONTEND-TELEGRAM, M-FRONTEND-MAX, V-M-FRONTEND-APP
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   AppPlatform - telegram | max | web union
//   getAppPlatform - sync platform guess from initData or ?platform override
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.1.0 - Added platform detection for Telegram/MAX/web login variants]
// END_CHANGE_SUMMARY

import { getTelegramInitData } from './telegram-sdk';
import { getMaxInitData } from './max-sdk';

export type AppPlatform = 'telegram' | 'max' | 'web';

// START_CONTRACT: getAppPlatform
//   PURPOSE: Return the launch platform used to pick the login variant
//   INPUTS: { none - reads messenger initData and location.search }
//   OUTPUTS: { AppPlatform - telegram, max, or web }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-TELEGRAM, M-FRONTEND-MAX, fn-getTelegramInitData, fn-getMaxInitData
// END_CONTRACT: getAppPlatform
export function getAppPlatform(): AppPlatform {
  // START_BLOCK_DETECT_PLATFORM
  // ?platform=telegram|max|web — демо-переключатель для проверки вариантов
  // входа в браузере без реальных мессенджеров.
  if (typeof window !== 'undefined') {
    const override = new URLSearchParams(window.location.search).get('platform');
    if (override === 'telegram' || override === 'max' || override === 'web') {
      return override;
    }
  }
  // SDK-скрипты обоих мессенджеров грузятся всегда (см. index.html), поэтому
  // присутствие window-объектов ни о чём не говорит — смотрим только initData.
  if (getMaxInitData()) return 'max';
  if (getTelegramInitData()) return 'telegram';
  return 'web';
  // END_BLOCK_DETECT_PLATFORM
}
