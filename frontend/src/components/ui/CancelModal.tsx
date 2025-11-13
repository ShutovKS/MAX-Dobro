import React from 'react';
import {HelpCircle} from 'lucide-react';

const CancelModal: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({isOpen, onConfirm, onCancel}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" role="dialog"
         aria-modal="true">
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in">
        <HelpCircle className="w-20 h-20 text-blue-400" strokeWidth={1.5}/>

        <h2 className="text-2xl font-bold text-[#0C0D0E]">Отменить участие?</h2>

        <p className="text-[rgb(12,13,14,0.52)]">
          Организатор рассчитывает на вас. Если вы отмените запись, ваше место может занять кто-то другой. Вы уверены?
        </p>

        <div
          className="w-full flex flex-col-reverse sm:flex-row space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3 pt-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-transparent text-[#FF303C] font-semibold py-3 px-4 rounded-xl hover:bg-red-50 transition-colors"
          >
            Да, отменить
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity"
          >
            Остаться
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;