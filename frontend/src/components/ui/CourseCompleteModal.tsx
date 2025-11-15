import React from 'react';
import {GraduationCap} from 'lucide-react';

interface CourseCompleteModalProps {
  isOpen: boolean;
  courseTitle: string;
  onViewCertificate: () => void;
  onClose: () => void;
}

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
          <GraduationCap className="w-24 h-24 text-brand"/>
        </div>

        <h2 className="text-3xl font-bold text-action-success">Курс пройден!</h2>

        <p className="text-text-secondary">
          Вы успешно завершили курс «{courseTitle}». Ваш сертификат уже в профиле!
        </p>

        <button
          onClick={onViewCertificate}
          className="w-full bg-gradient-success text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
        >
          Посмотреть сертификат
        </button>

        <button onClick={onClose} className="text-sm text-text-secondary font-semibold hover:underline">
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default CourseCompleteModal;