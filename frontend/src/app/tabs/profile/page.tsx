import React from 'react';
import type {ProfileSubScreen, User} from '../../../lib/types';
import {AnimalFriendIcon, ChevronRightIcon, SettingsIcon} from '../../../components/ui/icons';
import WeeklyChallengeWidget from '../../../features/challenges/components/WeeklyChallengeWidget';

const StatCard: React.FC<{
  value: string;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}> = React.memo(({value, label, Icon, onClick}) => {
  const content = (
    <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-full">
      <Icon className="w-8 h-8 text-[#007AFF] mb-2"/>
      <span className="text-2xl font-bold text-[#0C0D0E]">{value}</span>
      <span className="text-sm text-[rgb(12,13,14,0.52)] leading-tight">{label}</span>
    </div>
  );

  if (onClick) {
    return <button onClick={onClick} className="w-full h-full transition-transform active:scale-95">{content}</button>;
  }
  return content;
});

const AchievementBadge: React.FC<{ achievement: User['achievements'][0] }> = React.memo(({achievement}) => (
  <div className="flex-shrink-0 w-24 text-center">
    <div
      className="w-20 h-20 mx-auto rounded-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] flex items-center justify-center shadow-md mb-1">
      <achievement.Icon className="w-12 h-12 text-white"/>
    </div>
    <span className="text-xs font-semibold text-[rgb(12,13,14,0.52)]">{achievement.name}</span>
  </div>
));

const mockChallenge = {
  title: "Челлендж недели",
  description: "Помогите животным 1 раз",
  reward: "Награда: +100 баллов кармы ✨",
  Icon: AnimalFriendIcon,
  progress: 0,
  target: 1,
  filterCategory: "Животные",
};

const ProfilePage: React.FC<{ user: User; onSwitchToOrganizationMode: () => void; }> = ({
                                                                                          user,
                                                                                          onSwitchToOrganizationMode
                                                                                        }) => {

  const onNavigate = (screen: ProfileSubScreen) => {
    window.location.hash = `#/profile/${screen}`;
  };

  const onFindEvent = (category?: string) => {
    // A more robust solution would involve passing query params
    // For now, we just navigate to the home page for filtering
    window.location.hash = '#/home';
  };

  const handleStatClick = (statId: string) => {
    switch (statId) {
      case 'hours':
      case 'events':
        onNavigate('activityHistory');
        break;
      case 'achievements':
        onNavigate('allAchievements');
        break;
      case 'karma':
        onNavigate('rewardsStore');
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full min-h-full bg-gray-50 pb-10">
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-[28px] font-bold text-[#0C0D0E]">Мой путь</h1>
        <button onClick={() => onNavigate('settings')} className="text-gray-500 hover:text-[#007AFF]">
          <SettingsIcon className="w-6 h-6"/>
        </button>
      </header>

      <section className="px-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img src={user.avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full shadow-lg"/>
            </div>
            <h2 className="text-2xl font-bold text-[#0C0D0E]">{`${user.firstName} ${user.lastName}`}</h2>
            <p className="text-sm font-semibold text-[#007AFF]">{user.level}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 my-6">
            {user.stats.map(stat => (
              <StatCard
                key={stat.id}
                {...stat}
                onClick={() => handleStatClick(stat.id)}
              />
            ))}
          </div>

          <div className="w-full">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] h-2.5 rounded-full"
                   style={{width: `${user.progress}%`}}></div>
            </div>
            <div className="flex justify-between text-xs text-[rgb(12,13,14,0.52)] mt-1">
              <span>Прогресс</span>
              <span>{user.progress}% до "{user.nextLevel}"</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 mb-6">
        <WeeklyChallengeWidget
          challenge={mockChallenge}
          isCompleted={false}
          onCtaClick={onFindEvent}
        />
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center px-6 mb-3">
          <h3 className="text-xl font-bold text-[#0C0D0E]">Последние достижения</h3>
          <button onClick={() => onNavigate('allAchievements')} className="text-sm font-semibold text-[#007AFF]">Все
          </button>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-2 -mx-6 px-6">
          {user.achievements.map(ach => (
            <AchievementBadge key={ach.id} achievement={ach}/>
          ))}
          <div className="flex-shrink-0 w-24 flex items-center justify-center">
            <button onClick={() => onNavigate('allAchievements')}
                    className="w-20 h-20 rounded-full bg-gray-100 flex flex-col items-center justify-center text-center text-xs font-semibold text-[rgb(12,13,14,0.52)] hover:bg-gray-200 transition-colors">
              <span>Все</span>
              <span>достижения</span>
            </button>
          </div>
        </div>
      </section>

      <section className="px-6">
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {user.navigation.map(item => {
            const handleClick = () => {
              if (item.id === 'switchToOrganization') {
                onSwitchToOrganizationMode();
              } else {
                onNavigate(item.id as ProfileSubScreen);
              }
            };
            return (
              <button
                key={item.id}
                onClick={handleClick}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors">
                <div className="flex items-center space-x-4">
                  <item.Icon className="w-6 h-6 text-gray-500"/>
                  <span className="font-semibold text-[#0C0D0E]">{item.label}</span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400"/>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;