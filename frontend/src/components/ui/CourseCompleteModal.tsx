// FILE: frontend/src/components/ui/CourseCompleteModal.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Celebrate course completion and offer certificate navigation.
//   SCOPE: Show completion copy, view-certificate action, and close
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   CourseCompleteModal - course-complete celebration dialog
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import {GraduationCap} from 'lucide-react';

interface CourseCompleteModalProps {
  isOpen: boolean;
  courseTitle: string;
  onViewCertificate: () => void;
  onClose: () => void;
}

// START_CONTRACT: CourseCompleteModal
//   PURPOSE: Show course-complete celebration and certificate action
//   INPUTS: { isOpen: boolean; courseTitle: string; onViewCertificate: () => void; onClose: () => void }
//   OUTPUTS: { ReactElement | null - dialog when open }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: CourseCompleteModal
const CourseCompleteModal: React.FC<CourseCompleteModalProps> = ({
                                                                   isOpen,
                                                                   courseTitle,
                                                                   onViewCertificate,
                                                                   onClose
                                                                 }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in">
        <div className="w-32 h-32 flex items-center justify-center animate-pop-in">
          <GraduationCap className="w-24 h-24 text-[#007AFF]"/>
        </div>

        <h2 className="text-3xl font-bold text-[#1ABE43]">Курс пройден!</h2>

        <p className="text-[rgb(12,13,14,0.52)]">
          Вы успешно завершили курс «{courseTitle}». Ваш сертификат уже в профиле!
        </p>

        <button
          onClick={onViewCertificate}
          className="w-full bg-[linear-gradient(158deg,#14E1D5_6.15%,#03C722_85.68%)] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
        >
          Посмотреть сертификат
        </button>

        <button onClick={onClose} className="text-sm text-[rgb(12,13,14,0.52)] font-semibold hover:underline">
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default CourseCompleteModal;
