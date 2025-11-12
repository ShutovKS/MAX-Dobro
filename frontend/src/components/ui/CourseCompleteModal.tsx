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
        {/* Element 1: Animated Icon */}
        <div className="w-32 h-32 flex items-center justify-center animate-pop-in">
          <GraduationCap className="w-24 h-24 text-[#007AFF]"/>
        </div>

        {/* Element 2: Title */}
        <h2 className="text-3xl font-bold text-[#1ABE43]">Курс пройден!</h2>

        {/* Element 3: Subtitle */}
        <p className="text-[rgb(12,13,14,0.52)]">
          Вы успешно завершили курс «{courseTitle}». Ваш сертификат уже в профиле!
        </p>

        {/* Element 4: Primary Button */}
        <button
          onClick={onViewCertificate}
          className="w-full bg-[linear-gradient(158deg,#14E1D5_6.15%,#03C722_85.68%)] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
        >
          Посмотреть сертификат
        </button>

        {/* Element 5: Secondary Button */}
        <button onClick={onClose} className="text-sm text-[rgb(12,13,14,0.52)] font-semibold hover:underline">
          Закрыть
        </button>
      </div>
      <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
                
                @keyframes scale-in { 
                    from { transform: scale(0.95); opacity: 0; } 
                    to { transform: scale(1); opacity: 1; } 
                }
                .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
                
                @keyframes pop-in { 
                    0% { transform: scale(0.8) rotate(-15deg); opacity: 0; } 
                    60% { transform: scale(1.1) rotate(5deg); }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; } 
                }
                .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s forwards; animation-fill-mode: backwards; }
            `}</style>
    </div>
  );
};

export default CourseCompleteModal;