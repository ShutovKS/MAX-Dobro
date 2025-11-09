import React, {useState} from 'react';
import {
  AnimalFriendIcon,
  ArtVolunteerIcon,
  CheckCircleIcon,
  ElderlyHelperIcon,
  NatureProtectorIcon
} from '../../components/ui/icons';

const interests = [
  {id: 'nature', title: 'Защитник природы', Icon: NatureProtectorIcon},
  {id: 'animals', title: 'Друг животных', Icon: AnimalFriendIcon},
  {id: 'seniors', title: 'Помощник старшим', Icon: ElderlyHelperIcon},
  {id: 'art', title: 'Арт-волонтер', Icon: ArtVolunteerIcon},
];

interface InterestCardProps {
  title: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isSelected: boolean;
  onClick: () => void;
}

const InterestCard: React.FC<InterestCardProps> = ({title, Icon, isSelected, onClick}) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-full aspect-square bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-end items-center text-center transition-all duration-200 ${isSelected ? 'border-2 border-[#007AFF]' : 'border-2 border-transparent'}`}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 text-white bg-[#007AFF] rounded-full">
          <CheckCircleIcon className="w-6 h-6"/>
        </div>
      )}
      <div className="flex-grow flex items-center justify-center">
        <Icon className="w-20 h-20"/>
      </div>
      <h3 className="font-bold text-[#0C0D0E] text-md mt-2">{title}</h3>
    </button>
  );
};

const OnboardingPage: React.FC<{ onComplete: () => void }> = ({onComplete}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isContinueEnabled = selectedInterests.length > 0;

  return (
    <div className="bg-white w-full min-h-screen flex flex-col p-6 font-sans antialiased">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-[#0C0D0E]">Какой вы герой?</h1>
          <p className="text-[rgb(12,13,14,0.52)] mt-2">Выберите одно или несколько направлений, которые вам близки.</p>
        </div>

        <div className="w-full max-w-sm grid grid-cols-2 gap-4">
          {interests.map(interest => (
            <InterestCard
              key={interest.id}
              title={interest.title}
              Icon={interest.Icon}
              isSelected={selectedInterests.includes(interest.id)}
              onClick={() => toggleInterest(interest.id)}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto mt-8">
        <button
          onClick={onComplete}
          disabled={!isContinueEnabled}
          className={`w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${isContinueEnabled ? 'bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] hover:opacity-90 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
