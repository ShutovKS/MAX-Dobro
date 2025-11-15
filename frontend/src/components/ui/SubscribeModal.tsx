import React from 'react';
import {Bell} from 'lucide-react';

const SubscribeModal: React.FC<{
  isOpen: boolean;
  organizationName: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({isOpen, organizationName, onConfirm, onCancel}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" role="dialog"
         aria-modal="true" aria-labelledby="subscribe-title">
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <Bell className="w-12 h-12 text-brand"/>
        </div>

        <h2 id="subscribe-title" className="text-2xl font-bold text-text-primary">Подписаться на обновления?</h2>

        <p className="text-text-secondary">
          Вы будете получать уведомления о новых событиях от организации "<span
          className="font-semibold">{organizationName}</span>".
        </p>

        <div className="w-full flex space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-transparent text-brand font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-brand text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-brand-dark transition-opacity"
          >
            Подписаться
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscribeModal;