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
          <Bell className="w-12 h-12 text-[#007AFF]"/>
        </div>

        <h2 id="subscribe-title" className="text-2xl font-bold text-[#0C0D0E]">Подписаться на обновления?</h2>

        <p className="text-[rgb(12,13,14,0.52)]">
          Вы будете получать уведомления о новых событиях от организации "<span
          className="font-semibold">{organizationName}</span>".
        </p>

        <div className="w-full flex space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-transparent text-[#007AFF] font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity"
          >
            Подписаться
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscribeModal;