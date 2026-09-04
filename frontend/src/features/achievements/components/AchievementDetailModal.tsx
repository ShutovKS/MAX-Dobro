// FILE: frontend/src/features/achievements/components/AchievementDetailModal.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Bottom-sheet detail for unlocked or locked achievements.
//   SCOPE: Show icon, description, unlock date or progress, share or CTA
//   DEPENDS: M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AchievementDetailModal - achievement detail bottom sheet
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import type { Achievement } from '../../../lib/types';
import { Lock } from 'lucide-react';
import { iconMap } from '../../../lib/iconMap';

// START_CONTRACT: AchievementDetailModal
//   PURPOSE: Show achievement details and a share or progress CTA
//   INPUTS: { achievement: Achievement | null; onClose: () => void; onNavigateWithFilter: (category: string) => void }
//   OUTPUTS: { ReactElement | null - bottom sheet when an achievement is present }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: AchievementDetailModal
const AchievementDetailModal: React.FC<{
  achievement: Achievement | null;
  onClose: () => void;
  onNavigateWithFilter: (category: string) => void;
}> = ({ achievement, onClose, onNavigateWithFilter }) => {
  if (!achievement) return null;

  const IconComponent = iconMap[achievement.icon] || Lock;
  const progressPercentage =
    achievement.progress !== undefined && achievement.target
      ? (achievement.progress / achievement.target) * 100
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-t-2xl shadow-xl p-6 w-full max-w-lg text-center flex flex-col items-center space-y-4 transition-transform duration-300 translate-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>

        {achievement.unlocked ? (
          <>
            {/* START_BLOCK_RENDER_UNLOCKED */}
            <div className="w-32 h-32 rounded-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] flex items-center justify-center shadow-lg -mt-20 mb-2 animate-pop-in">
              <IconComponent className="w-20 h-20 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#0C0D0E]">
              {achievement.name}
            </h2>
            <p className="text-[rgb(12,13,14,0.52)] max-w-sm">
              {achievement.description}
            </p>
            <p className="text-sm text-[rgb(12,13,14,0.52)]">
              Получено: {achievement.unlockedDate}
            </p>
            <button className="w-full bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition-colors mt-2">
              Поделиться достижением
            </button>
            {/* END_BLOCK_RENDER_UNLOCKED */}
          </>
        ) : (
          <>
            {/* START_BLOCK_RENDER_LOCKED */}
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center -mt-20 mb-2 animate-pop-in">
              <Lock className="w-20 h-20 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-500">
              {achievement.name}
            </h2>
            <p className="text-[#0C0D0E] font-medium max-w-sm">
              {achievement.description}
            </p>

            {achievement.progress !== undefined && achievement.target > 0 && (
              <div className="w-full max-w-xs pt-2">
                <p className="text-sm text-[rgb(12,13,14,0.52)] mb-1">
                  Прогресс: {achievement.progress} из {achievement.target}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#007AFF] h-2 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={() =>
                onNavigateWithFilter(achievement.filterCategory || 'Все')
              }
              className="w-full bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-blue-600 transition-colors mt-2"
            >
              {achievement.cta || 'К цели!'}
            </button>
            {/* END_BLOCK_RENDER_LOCKED */}
          </>
        )}
      </div>
    </div>
  );
};

export default AchievementDetailModal;
