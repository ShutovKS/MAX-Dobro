// FILE: frontend/src/components/ui/Toast.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Transient toast feedback with optional undo.
//   SCOPE: Auto-dismiss timer, success/info presentation, undo action
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI, export-Toast
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   Toast - timed bottom toast with optional undo
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, {useEffect} from 'react';
import {CheckCircle} from 'lucide-react';
import {TOAST_DURATION} from '../../lib/constants';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'info';
  onUndo?: () => void;
}

// START_CONTRACT: Toast
//   PURPOSE: Show timed toast feedback and optional undo
//   INPUTS: { message: string; show: boolean; onClose: () => void; duration?: number; type?: 'success' | 'info'; onUndo?: () => void }
//   OUTPUTS: { ReactElement - toast overlay }
//   SIDE_EFFECTS: schedules onClose after duration when shown
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI, export-Toast
// END_CONTRACT: Toast
const Toast: React.FC<ToastProps> = ({
                                       message,
                                       show,
                                       onClose,
                                       duration = TOAST_DURATION,
                                       type = 'info',
                                       onUndo,
                                     }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const handleUndoClick = () => {
    if (onUndo) {
      onUndo();
    }
    onClose();
  };

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-11/12 max-w-sm transform transition-all duration-300 ease-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}
    >
      <div className="bg-gray-800 text-white py-3 px-4 rounded-2xl shadow-lg flex flex-col items-start space-y-2">
        <div className="flex items-center space-x-3">
          {type === 'success' && <CheckCircle className="w-6 h-6 text-[#1ABE43]" fill="currentColor"/>}
          <span className="text-sm">{message}</span>
        </div>
        {onUndo && (
          <button onClick={handleUndoClick}
                  className="font-semibold text-blue-400 hover:text-blue-300 whitespace-nowrap self-end text-sm">
            Отменить
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
