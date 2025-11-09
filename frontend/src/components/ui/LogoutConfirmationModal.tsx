import React from 'react';

const LogoutConfirmationModal: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({isOpen, onConfirm, onCancel}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" role="dialog"
         aria-modal="true" aria-labelledby="logout-title">
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in">
        {/* Element 1: Title */}
        <h2 id="logout-title" className="text-2xl font-bold text-[#0C0D0E]">Вы уверены, что хотите выйти?</h2>

        {/* Element 2: Subtitle */}
        <p className="text-[rgb(12,13,14,0.52)]">
          Вам потребуется снова войти, чтобы продолжить.
        </p>

        {/* Element 3: Buttons */}
        <div className="w-full flex flex-col space-y-3 pt-2">
          {/* Safe button on top */}
          <button
            onClick={onCancel}
            className="w-full bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity"
          >
            Остаться
          </button>
          {/* Destructive button below */}
          <button
            onClick={onConfirm}
            className="w-full bg-transparent text-[#FF303C] font-semibold py-3 px-4 rounded-xl hover:bg-red-50 transition-colors"
          >
            Выйти
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

export default LogoutConfirmationModal;
