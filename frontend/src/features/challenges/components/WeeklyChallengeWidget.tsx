import React from 'react';
import {CheckCircle} from 'lucide-react';

interface WeeklyChallengeWidgetProps {
  challenge: {
    title: string;
    description: string;
    reward: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    progress: number;
    target: number;
    filterCategory: string;
  };
  isCompleted: boolean;
  onCtaClick: (category: string) => void;
}

const WeeklyChallengeWidget: React.FC<WeeklyChallengeWidgetProps> = ({challenge, isCompleted, onCtaClick}) => {
  const progressPercentage = (challenge.progress / challenge.target) * 100;

  if (isCompleted) {
    return (
      <div
        className="w-full bg-[linear-gradient(158deg,#14E1D5_6.15%,#03C722_85.68%)] rounded-2xl p-4 flex items-center text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8">
          <challenge.Icon className="w-32 h-32 opacity-20 transform rotate-12"/>
        </div>
        <div className="flex-shrink-0 mr-4 z-10">
          <CheckCircle className="w-16 h-16 text-white"/>
        </div>
        <div className="flex-1 z-10">
          <h3 className="font-bold text-lg">Челлендж выполнен!</h3>
          <p className="text-sm opacity-90">{challenge.reward}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-[linear-gradient(155deg,#BF97FF_6.6%,#526EFF_84.12%)] rounded-2xl p-4 flex items-center text-white shadow-lg relative overflow-hidden text-left">
      <div className="absolute -right-8 -bottom-8">
        <challenge.Icon className="w-32 h-32 opacity-20 transform -rotate-12"/>
      </div>
      <div className="flex-shrink-0 mr-4 z-10">
        <challenge.Icon className="w-16 h-16 opacity-80"/>
      </div>
      <div className="flex-1 space-y-2 z-10">
        <div>
          <p className="font-bold text-sm opacity-80">{challenge.title}</p>
          <h3 className="font-bold text-lg leading-tight">{challenge.description}</h3>
          <p className="text-xs opacity-90 mt-1">{challenge.reward}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-full bg-white/30 rounded-full h-1.5 flex-1">
            <div className="bg-yellow-300 h-1.5 rounded-full" style={{width: `${progressPercentage}%`}}></div>
          </div>
          <span className="text-xs font-mono">{challenge.progress}/{challenge.target}</span>
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
  );
};
export default WeeklyChallengeWidget;