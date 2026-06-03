// Хуки для нативных элементов Telegram WebApp (BackButton / MainButton).
// Безопасны вне Telegram: если SDK/кнопки нет — ничего не делают, экран
// продолжает работать со своими внутренними кнопками.
import { useEffect } from 'react';
import {
  getTelegramBackButton,
  getTelegramMainButton,
  isTelegramClient,
} from './telegram-sdk';

/** true, если активны нативные кнопки Telegram (значит внутренние можно скрыть). */
export const telegramUiActive = (): boolean => isTelegramClient();

/** Показывает нативную кнопку «Назад» и вешает обработчик на время жизни экрана. */
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
