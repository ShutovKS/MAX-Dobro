// FILE: frontend/src/app/profile/leaderboard/page.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Karma leaderboard with period tabs, podium, and current-user footer.
//   SCOPE: Load leaderboard by period, podium, list, current user fallback
//   DEPENDS: M-FRONTEND-API, M-FRONTEND-UI, M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   LeaderboardPage - karma leaderboard
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, {useEffect, useMemo, useState} from 'react';
import {fetchLeaderboardData} from '../../../lib/api';
import type {LeaderboardUser, User} from '../../../lib/types';
import {ArrowLeft, Star} from 'lucide-react';
import {BronzeMedalIcon, GoldMedalIcon, SilverMedalIcon} from '../../../components/ui/icons';

type Period = 'week' | 'month' | 'allTime';

const PodiumMember: React.FC<{
  user: LeaderboardUser;
  rank: number;
  className?: string;
  medal: React.ReactNode
}> = React.memo(({user, rank, className, medal}) => (
  <div className={`flex flex-col items-center ${className}`}>
    <div className="relative">
      <img loading="lazy" src={user.avatarUrl} alt={user.name}
           className="w-20 h-20 rounded-full border-4 border-white shadow-lg"/>
      <div className="absolute -bottom-2 -right-2">{medal}</div>
    </div>
    <h3 className="font-bold text-md text-[#0C0D0E] mt-2">{user.name}</h3>
    <p className="text-sm font-semibold text-[#007AFF]">{user.karma.toLocaleString('ru-RU')} кармы</p>
  </div>
));

const Podium: React.FC<{ users: LeaderboardUser[] }> = React.memo(({users}) => {
  const [first, second, third] = users;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-around items-end">
      {second &&
          <PodiumMember user={second} rank={2} className="w-1/3 mt-6" medal={<SilverMedalIcon className="w-8 h-8"/>}/>}
      {first &&
          <PodiumMember user={first} rank={1} className="w-1/3 mb-6" medal={<GoldMedalIcon className="w-10 h-10"/>}/>}
      {third &&
          <PodiumMember user={third} rank={3} className="w-1/3 mt-8" medal={<BronzeMedalIcon className="w-8 h-8"/>}/>}
    </div>
  );
});

const LeaderboardRow: React.FC<{ user: LeaderboardUser; isCurrentUser: boolean; }> = React.memo(({
                                                                                                   user,
                                                                                                   isCurrentUser
                                                                                                 }) => (
  <div className={`flex items-center p-4 rounded-xl ${isCurrentUser ? 'bg-blue-100' : ''}`}>
    <span className="font-bold text-lg text-gray-500 w-8">{user.rank > 0 ? user.rank : '—'}</span>
    <img loading="lazy" src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full mx-4"/>
    <span className="font-semibold text-md text-[#0C0D0E] flex-1">{user.name}</span>
    <div className="flex items-center space-x-1">
      <span className="font-bold text-md text-[#0C0D0E]">{user.karma.toLocaleString('ru-RU')}</span>
      <Star className="w-4 h-4 text-yellow-400 fill-current"/>
    </div>
  </div>
));

const UserPositionFooter: React.FC<{ user: LeaderboardUser | undefined }> = ({user}) => {
  if (!user) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-center p-4 rounded-xl">
          <p className="text-[rgb(12,13,14,0.52)] font-semibold">У вас пока 0 баллов. Начните помогать, чтобы попасть в
            рейтинг!</p>
        </div>
      </div>
    );
  }
  return (
    <div
      className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <LeaderboardRow user={user} isCurrentUser={true}/>
    </div>
  );
};

const SkeletonPodium = () => (
  <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-around items-end animate-pulse">
    <div className="flex flex-col items-center w-1/3 mt-6">
      <div className="w-20 h-20 rounded-full bg-gray-200"></div>
      <div className="h-4 bg-gray-200 rounded w-20 mt-2"></div>
      <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
    </div>
    <div className="flex flex-col items-center w-1/3 mb-6">
      <div className="w-20 h-20 rounded-full bg-gray-200"></div>
      <div className="h-4 bg-gray-200 rounded w-20 mt-2"></div>
      <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
    </div>
    <div className="flex flex-col items-center w-1/3 mt-8">
      <div className="w-20 h-20 rounded-full bg-gray-200"></div>
      <div className="h-4 bg-gray-200 rounded w-20 mt-2"></div>
      <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
    </div>
  </div>
);

const SkeletonRow = () => (
  <div className="flex items-center p-4 animate-pulse">
    <div className="w-8 h-6 bg-gray-200 rounded"></div>
    <div className="w-12 h-12 rounded-full bg-gray-200 mx-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3 flex-1"></div>
    <div className="h-5 bg-gray-200 rounded w-16"></div>
  </div>
);

// START_CONTRACT: LeaderboardPage
//   PURPOSE: Load leaderboard data for a period and render ranks
//   INPUTS: { user: User; onBack: () => void }
//   OUTPUTS: { ReactElement - leaderboard }
//   SIDE_EFFECTS: fetchLeaderboardData
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS, fn-fetchLeaderboardData
// END_CONTRACT: LeaderboardPage
const LeaderboardPage: React.FC<{ user: User; onBack: () => void; }> = ({user, onBack}) => {
  const [activeTab, setActiveTab] = useState<Period>('month');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);

  useEffect(() => {
    // START_BLOCK_LOAD_LEADERBOARD
    const loadData = async () => {
      setLoading(true);
      const leaderboardData = await fetchLeaderboardData(activeTab);
      setData(leaderboardData.topUsers ?? []);
      setCurrentUser(leaderboardData.currentUser ?? null);
      setLoading(false);
    };
    loadData();
  }, [activeTab]);
    // END_BLOCK_LOAD_LEADERBOARD

  const topThree = useMemo(() => data.slice(0, 3), [data]);
  const listData = useMemo(() => data.slice(3, 100), [data]);

  // Реальный текущий пользователь из ответа API; если за период активности нет —
  // показываем его же с реальной кармой (0) и аватаркой, чтобы данные были консистентны.
  const currentUserData = useMemo<LeaderboardUser | undefined>(() => {
    if (currentUser) return currentUser;
    if (user.id == null) return undefined;
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      avatarUrl: user.avatarUrl,
      karma: Number(user.stats?.find((s) => s.label === 'Карма')?.value ?? 0),
      rank: 0,
    };
  }, [currentUser, user]);

  // START_BLOCK_RENDER_LEADERBOARD
  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center">
        <button onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-2xl font-bold text-[#0C0D0E] mx-auto">Рейтинг героев</h1>
        <div className="w-8"></div>
      </header>

      <nav className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button onClick={() => setActiveTab('week')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'week' ? 'bg-white shadow text-[#007AFF]' : 'text-[rgb(12,13,14,0.52)]'}`}>За
            неделю
          </button>
          <button onClick={() => setActiveTab('month')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'month' ? 'bg-white shadow text-[#007AFF]' : 'text-[rgb(12,13,14,0.52)]'}`}>За
            месяц
          </button>
          <button onClick={() => setActiveTab('allTime')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'allTime' ? 'bg-white shadow text-[#007AFF]' : 'text-[rgb(12,13,14,0.52)]'}`}>За
            все время
          </button>
        </div>
      </nav>

      <main className="flex-grow overflow-y-auto p-6 space-y-6 pb-28">
        {loading ? (
          <>
            <SkeletonPodium/>
            <div className="bg-white rounded-2xl shadow-sm p-2 space-y-2">
              <SkeletonRow/>
              <SkeletonRow/>
              <SkeletonRow/>
              <SkeletonRow/>
            </div>
          </>
        ) : (
          <>
            <Podium users={topThree}/>
            <div className="bg-white rounded-2xl shadow-sm p-2">
              {listData.map(user => (
                <LeaderboardRow key={user.id} user={user} isCurrentUser={currentUserData?.id === user.id}/>
              ))}
            </div>
          </>
        )}
      </main>

      <UserPositionFooter user={currentUserData}/>
    </div>
  );
  // END_BLOCK_RENDER_LEADERBOARD
};

export default LeaderboardPage;