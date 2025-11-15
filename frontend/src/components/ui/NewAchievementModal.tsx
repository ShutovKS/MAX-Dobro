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
        <div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 flex items-center justify-center shadow-lg mb-2 animate-pop-in">
          <achievement.Icon className="w-20 h-20 text-white"/>
        </div>

        <h2 className="text-3xl font-bold text-[#0C0D0E]">Новое достижение!</h2>

        <p className="text-gray-600">
          Получена ачивка «<span className="font-semibold">{achievement.name}</span>»
        </p>

        <div className="w-full flex space-x-3 pt-2">
          <button
            onClick={onNavigateToAchievements}
            className="flex-1 bg-transparent text-[#007AFF] font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors"
          >
            К достижениям
          </button>
          <button

            className="flex-1 bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity"
          >
            Поделиться
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewAchievementModal;