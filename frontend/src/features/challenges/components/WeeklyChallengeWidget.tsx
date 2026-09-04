// FILE: frontend/src/features/challenges/components/WeeklyChallengeWidget.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Home-feed widget for weekly challenge progress or completion.
//   SCOPE: Show reward, progress bar, and CTA when the challenge is active
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   WeeklyChallengeWidget - weekly challenge progress or completed banner
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { iconMap } from '../../../lib/iconMap';

interface WeeklyChallengeWidgetProps {
  challenge: {
    title: string;
    description: string;
    reward: string;
    icon: string;
    progress: number;
    target: number;
    filterCategory: string;
  };
  isCompleted: boolean;
  onCtaClick: (category: string) => void;
}

// START_CONTRACT: WeeklyChallengeWidget
//   PURPOSE: Render weekly challenge progress or a completed banner
//   INPUTS: { challenge: { title, description, reward, icon, progress, target, filterCategory }; isCompleted: boolean; onCtaClick: (category: string) => void }
//   OUTPUTS: { ReactElement - challenge banner }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: WeeklyChallengeWidget
const WeeklyChallengeWidget: React.FC<WeeklyChallengeWidgetProps> = ({
  challenge,
  isCompleted,
  onCtaClick,
}) => {
  const IconComponent = iconMap[challenge.icon] || CheckCircle;
  const progressPercentage = (challenge.progress / challenge.target) * 100;

  if (isCompleted) {
    return (
      // START_BLOCK_RENDER_COMPLETED
      <div className="w-full bg-[linear-gradient(158deg,#14E1D5_6.15%,#03C722_85.68%)] rounded-2xl p-4 flex items-center text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8">
          <IconComponent className="w-32 h-32 opacity-20 transform rotate-12" />
        </div>
        <div className="flex-shrink-0 mr-4 z-10">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
        <div className="flex-1 z-10">
          <h3 className="font-bold text-lg">Челлендж выполнен!</h3>
          <p className="text-sm opacity-90">{challenge.reward}</p>
        </div>
      </div>
      // END_BLOCK_RENDER_COMPLETED
    );
  }

  return (
    // START_BLOCK_RENDER_IN_PROGRESS
    <div className="w-full bg-[linear-gradient(155deg,#BF97FF_6.6%,#526EFF_84.12%)] rounded-2xl p-4 flex items-center text-white shadow-lg relative overflow-hidden text-left">
      <div className="absolute -right-8 -bottom-8">
        <IconComponent className="w-32 h-32 opacity-20 transform -rotate-12" />
      </div>
      <div className="flex-shrink-0 mr-4 z-10">
        <IconComponent className="w-16 h-16 opacity-80" />
      </div>
      <div className="flex-1 space-y-2 z-10">
        <div>
          <p className="font-bold text-sm opacity-80">{challenge.title}</p>
          <h3 className="font-bold text-lg leading-tight">
            {challenge.description}
          </h3>
          <p className="text-xs opacity-90 mt-1">{challenge.reward}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-full bg-white/30 rounded-full h-1.5 flex-1">
            <div
              className="bg-yellow-300 h-1.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="text-xs font-mono">
            {challenge.progress}/{challenge.target}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 z-10 self-center ml-3">
        <button
          onClick={() => onCtaClick(challenge.filterCategory)}
          className="bg-white/30 hover:bg-white/40 text-white font-semibold py-2 px-5 rounded-xl text-sm transition-colors"
        >
          К цели
        </button>
      </div>
    </div>
    // END_BLOCK_RENDER_IN_PROGRESS
  );
};
export default WeeklyChallengeWidget;
