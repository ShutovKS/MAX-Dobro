import React from 'react';
import type {Achievement} from '../../lib/types';

const NewAchievementModal: React.FC<{
  achievement: Achievement | null;
  onClose: () => void;
  onNavigateToAchievements: () => void;
}> = ({achievement, onClose, onNavigateToAchievements}) => {
  if (!achievement) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Element 1: Animated Achievement Icon */}
        <div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 flex items-center justify-center shadow-lg mb-2 animate-pop-in">
          <achievement.Icon className="w-20 h-20 text-white"/>
        </div>

        {/* Element 2: Title */}
        <h2 className="text-3xl font-bold text-[#0C0D0E]">Новое достижение!</h2>

        {/* Element 3: Achievement Name */}
        <p className="text-gray-600">
          Получена ачивка «<span className="font-semibold">{achievement.name}</span>»
        </p>

        {/* Element 4: Action Buttons */}
        <div className="w-full flex space-x-3 pt-2">
          <button
            onClick={onNavigateToAchievements}
            className="flex-1 bg-transparent text-[#007AFF] font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors"
          >
            К достижениям
          </button>
          <button
            // onClick={onShare} // Future functionality
            className="flex-1 bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity"
          >
            Поделиться
          </button>
        </div>
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
                    0% { transform: scale(0.8); opacity: 0; } 
                    60% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; } 
                }
                .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s forwards; }
            `}</style>
    </div>
  );
};

export default NewAchievementModal;
