// FILE: frontend/src/components/ui/LogoutConfirmationModal.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Confirm that the volunteer wants to log out.
//   SCOPE: Stay or confirm logout when the modal is open
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   LogoutConfirmationModal - logout confirmation dialog
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';

// START_CONTRACT: LogoutConfirmationModal
//   PURPOSE: Confirm logout versus staying signed in
//   INPUTS: { isOpen: boolean; onConfirm: () => void; onCancel: () => void }
//   OUTPUTS: { ReactElement | null - dialog when open }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: LogoutConfirmationModal
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
        <h2 id="logout-title" className="text-2xl font-bold text-[#0C0D0E]">Вы уверены, что хотите выйти?</h2>

        <p className="text-[rgb(12,13,14,0.52)]">
          Вам потребуется снова войти, чтобы продолжить.
        </p>

        <div className="w-full flex flex-col space-y-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity"
          >
            Остаться
          </button>
          <button
            onClick={onConfirm}
            className="w-full bg-transparent text-[#FF303C] font-semibold py-3 px-4 rounded-xl hover:bg-red-50 transition-colors"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
