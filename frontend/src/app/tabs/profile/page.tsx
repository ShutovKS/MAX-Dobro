// FILE: frontend/src/app/tabs/profile/page.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Volunteer profile tab with stats, challenge, achievements, and shortcuts.
//   SCOPE: Load weekly challenge, stat navigation, organizer switch
//   DEPENDS: M-FRONTEND-API, M-FRONTEND-UI, M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   ProfilePage - profile tab hub
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, {useEffect, useState} from 'react';
import {useNavigate, useOutletContext} from 'react-router';
import type {ProfileSubScreen, User, WeeklyChallenge} from '../../../lib/types';
import {
  Briefcase,
  Calendar,
  ChevronRight,
  GraduationCap,
  List,
  MessageSquare,
  Settings,
  Star,
  Trophy
} from 'lucide-react';
import WeeklyChallengeWidget from '../../../features/challenges/components/WeeklyChallengeWidget';
import {fetchWeeklyChallenge} from '../../../lib/api';
import {iconMap} from '../../../lib/iconMap';

const StatCard: React.FC<{
  value: string;
  label: string;
  icon: string;
  onClick?: () => void;
}> = React.memo(({value, label, icon, onClick}) => {
  const IconComponent = iconMap[icon] || Star;
  const content = (
    <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-full">
      <IconComponent className="w-8 h-8 text-[#007AFF] mb-2"/>
      <span className="text-2xl font-bold text-[#0C0D0E]">{value}</span>
      <span className="text-sm text-[rgb(12,13,14,0.52)] leading-tight">{label}</span>
    </div>
  );

  if (onClick) {
    return <button onClick={onClick} className="w-full h-full transition-transform active:scale-95">{content}</button>;
  }
  return content;
});

const AchievementBadge: React.FC<{ achievement: User['achievements'][0] }> = React.memo(({achievement}) => {
  const IconComponent = iconMap[achievement.icon] || Star;
  return (
    <div className="flex-shrink-0 w-24 text-center">
      <div
        className="w-20 h-20 mx-auto rounded-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] flex items-center justify-center shadow-md mb-1">
        <IconComponent className="w-12 h-12 text-white"/>
      </div>
      <span className="text-xs font-semibold text-[rgb(12,13,14,0.52)]">{achievement.name}</span>
    </div>
  );
});

// START_CONTRACT: ProfilePage
//   PURPOSE: Render the volunteer profile hub from outlet user context
//   INPUTS: { none - reads user from Outlet context }
//   OUTPUTS: { ReactElement - profile hub }
//   SIDE_EFFECTS: fetchWeeklyChallenge; navigates to profile sub-screens
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS, fn-fetchWeeklyChallenge
// END_CONTRACT: ProfilePage
const ProfilePage: React.FC = () => {
  const {user, onSwitchToOrganizationMode} = useOutletContext<{ user: User, onSwitchToOrganizationMode: () => void }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<WeeklyChallenge | null>(null);

  useEffect(() => {
    // START_BLOCK_LOAD_PROFILE
    const loadChallenge = async () => {
      try {
        const challengeData = await fetchWeeklyChallenge();
        setChallenge(challengeData);
      } catch (error) {
        console.error("Failed to fetch weekly challenge", error);
      }
    };
    loadChallenge();
  }, []);
    // END_BLOCK_LOAD_PROFILE

  const onNavigate = (screen: ProfileSubScreen) => {
    navigate(`/app/profile/${screen}`);
  };

  const onFindEvent = (category?: string) => {
    navigate('/app/home');
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

  const navigationItems: { id: string; label: string; Icon: React.FC<any>; action: () => void; }[] = [
    {id: 'activityHistory', label: 'История активностей', Icon: List, action: () => onNavigate('activityHistory')},
    {id: 'calendar', label: 'Мой календарь', Icon: Calendar, action: () => onNavigate('calendar')},
    {id: 'myChats', label: 'Мои чаты', Icon: MessageSquare, action: () => onNavigate('myChats')},
    {id: 'myCertificates', label: 'Мои сертификаты', Icon: GraduationCap, action: () => onNavigate('myCertificates')},
    {id: 'leaderboards', label: 'Лидерборды', Icon: Trophy, action: () => onNavigate('leaderboards')},
    {id: 'rewardsStore', label: 'Магазин наград', Icon: Star, action: () => onNavigate('rewardsStore')},
  ];


  // START_BLOCK_RENDER_PROFILE
  return (
    <div className="w-full min-h-full bg-gray-50 pb-10">
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-[28px] font-bold text-[#0C0D0E]">Мой путь</h1>
        <button onClick={() => onNavigate('settings')} className="text-gray-500 hover:text-[#007AFF]">
          <Settings className="w-6 h-6"/>
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

      {challenge && (
        <section className="px-6 mb-6">
          <WeeklyChallengeWidget
            challenge={challenge}
            isCompleted={challenge.isCompleted}
            onCtaClick={onFindEvent}
          />
        </section>
      )}

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
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors">
              <div className="flex items-center space-x-4">
                <item.Icon className="w-6 h-6 text-gray-500"/>
                <span className="font-semibold text-[#0C0D0E]">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400"/>
            </button>
          ))}
        </div>
      </section>

      {user.role === 'organization' && (
        <section className="px-6 mt-6">
          <button
            onClick={onSwitchToOrganizationMode}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border-2 border-[#007AFF]/30 hover:bg-blue-50 transition-colors active:scale-[0.99]"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-[#007AFF]"/>
              </div>
              <div className="text-left">
                <span className="block font-semibold text-[#0C0D0E]">Кабинет организатора</span>
                <span className="text-xs text-[rgb(12,13,14,0.52)]">Управление событиями и организацией</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400"/>
          </button>
        </section>
      )}
    </div>
  );
  // END_BLOCK_RENDER_PROFILE
};

export default ProfilePage;
