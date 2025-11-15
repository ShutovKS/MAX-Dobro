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
        <h2 id="logout-title" className="text-2xl font-bold text-text-primary">Вы уверены, что хотите выйти?</h2>

        <p className="text-text-secondary">
          Вам потребуется снова войти, чтобы продолжить.
        </p>

        <div className="w-full flex flex-col space-y-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full bg-brand text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-brand-dark transition-opacity"
          >
            Остаться
          </button>
          <button
            onClick={onConfirm}
            className="w-full bg-transparent text-action-danger font-semibold py-3 px-4 rounded-xl hover:bg-red-50 transition-colors"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;