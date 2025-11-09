import React from 'react';

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
        {/* Element 1: Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
             className="w-20 h-20 text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/>
        </svg>

        {/* Element 2: Title */}
        <h2 className="text-2xl font-bold text-[#0C0D0E]">Отменить участие?</h2>

        {/* Element 3: Subtitle */}
        <p className="text-[rgb(12,13,14,0.52)]">
          Организатор рассчитывает на вас. Если вы отмените запись, ваше место может занять кто-то другой. Вы уверены?
        </p>

        {/* Element 4: Buttons */}
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
      <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                @keyframes scale-in { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .animate-scale-in { animation: scale-in 0.2s ease-out; }
            `}</style>
    </div>
  );
};

export default CancelModal;
