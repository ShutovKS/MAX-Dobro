// FILE: frontend/src/lib/useTelegramUI.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Bind Telegram WebApp BackButton and MainButton to React screen lifecycles.
//   SCOPE: telegramUiActive flag and native button hooks that no-op outside Telegram
//   DEPENDS: M-FRONTEND-TELEGRAM
//   LINKS: M-FRONTEND-TELEGRAM V-M-FRONTEND-TELEGRAM
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   telegramUiActive - true when native Telegram buttons should replace in-app chrome
//   useTelegramBackButton - show Telegram BackButton while a screen is mounted
//   useTelegramMainButton - configure Telegram MainButton while a screen is mounted
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { useEffect } from 'react';
import {
  getTelegramBackButton,
  getTelegramMainButton,
  isTelegramClient,
} from './telegram-sdk';

/** true, если активны нативные кнопки Telegram (значит внутренние можно скрыть). */
// START_CONTRACT: telegramUiActive
//   PURPOSE: Report whether native Telegram chrome should replace in-app buttons
//   INPUTS: { none }
//   OUTPUTS: { boolean - true inside a Telegram WebApp client }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-TELEGRAM fn-isTelegramClient
// END_CONTRACT: telegramUiActive
export const telegramUiActive = (): boolean => isTelegramClient();

/** Показывает нативную кнопку «Назад» и вешает обработчик на время жизни экрана. */
// START_CONTRACT: useTelegramBackButton
//   PURPOSE: Show Telegram BackButton and bind onBack for the screen lifetime
//   INPUTS: { onBack?: () => void - back handler; skipped when absent }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: shows/hides Telegram BackButton and registers click handlers
//   LINKS: M-FRONTEND-TELEGRAM fn-getTelegramBackButton
// END_CONTRACT: useTelegramBackButton
export function useTelegramBackButton(onBack?: () => void): void {
  useEffect(() => {
    const bb = getTelegramBackButton();
    if (!bb || !onBack) return;
    bb.show();
    bb.onClick(onBack);
    return () => {
      bb.offClick(onBack);
      bb.hide();
    };
  }, [onBack]);
}

interface MainButtonOptions {
  text: string;
  onClick: () => void;
  visible?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

/** Конфигурирует нативную MainButton Telegram. Скрывается при размонтировании. */
// START_CONTRACT: useTelegramMainButton
//   PURPOSE: Configure Telegram MainButton text, visibility, and click for a screen
//   INPUTS: { text: string; onClick: () => void; visible?: boolean; disabled?: boolean; loading?: boolean }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: mutates Telegram MainButton and hides it on unmount
//   LINKS: M-FRONTEND-TELEGRAM fn-getTelegramMainButton
// END_CONTRACT: useTelegramMainButton
export function useTelegramMainButton({
  text,
  onClick,
  visible = true,
  disabled = false,
  loading = false,
}: MainButtonOptions): void {
  useEffect(() => {
    const mb = getTelegramMainButton();
    if (!mb) return;
    if (!visible) {
      mb.hide();
      return;
    }
    mb.setText(text);
    mb.onClick(onClick);
    mb.show();
    if (disabled) mb.disable();
    else mb.enable();
    if (loading) mb.showProgress();
    else mb.hideProgress();
    return () => {
      mb.offClick(onClick);
      mb.hide();
    };
  }, [text, onClick, visible, disabled, loading]);
}
