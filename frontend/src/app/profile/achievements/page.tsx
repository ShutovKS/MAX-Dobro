import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {fetchAllAchievements} from '../../../lib/api';
import type {Achievement} from '../../../lib/types';
import {ArrowLeft, Lock} from 'lucide-react';
import {EmptyShelfIllustrationIcon} from '../../../components/ui/icons';
import AchievementDetailModal from '../../../features/achievements/components/AchievementDetailModal';
import EmptyState from '../../../components/ui/EmptyState';


const CircularProgressBar: React.FC<{ progress: number; size: number; strokeWidth: number; }> = ({
                                                                                                   progress,
                                                                                                   size,
                                                                                                   strokeWidth
                                                                                                 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        className="text-gray-200"
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="text-[#007AFF]"
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          transition: 'stroke-dashoffset 0.5s ease-out'
        }}
      />
    </svg>
  );
};

const AchievementBadge: React.FC<{ achievement: Achievement }> = ({achievement}) => {
  if (achievement.unlocked) {
    return (
      <div className="flex flex-col items-center text-center">
        <div
          className="w-24 h-24 rounded-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] flex items-center justify-center shadow-md mb-2">
          <achievement.Icon className="w-14 h-14 text-white"/>
        </div>
        <h4 className="font-bold text-sm text-[#0C0D0E]">{achievement.name}</h4>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center" title={achievement.description}>
      <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
        <Lock className="w-12 h-12 text-gray-400"/>
      </div>
      <h4 className="font-semibold text-sm text-[rgb(12,13,14,0.52)]">{achievement.name}</h4>
    </div>
  );
};

const AllAchievementsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const onBack = () => navigate('/app/profile');

  useEffect(() => {
    const loadAchievements = async () => {
      setLoading(true);
      const data = await fetchAllAchievements();
      setAchievements(data);
      setLoading(false);
    };
    loadAchievements();
  }, []);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  const totalCount = achievements.length;
  const unlockedCount = unlockedAchievements.length;
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const handleNavigateWithFilter = (category: string) => {
    setSelectedAchievement(null);
    if (category === 'Обучение') {
      navigate('/app/training');
    } else if (category === 'Организации') {
      navigate('/app/organizations');
    } else {
      // For other categories, just go home and user can filter
      navigate('/app/home');
    }
  };

  const onFindEvent = () => navigate('/app/home');

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center">
        <button onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-2xl font-bold text-[#0C0D0E] mx-auto">Мои достижения</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-6 space-y-8">
        {loading ? <p className="text-center text-gray-500">Загрузка достижений...</p> : (
          <>
            <section className="bg-white rounded-2xl shadow-sm p-6 flex items-center space-x-6">
              <div className="relative">
                <CircularProgressBar progress={progress} size={80} strokeWidth={8}/>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#0C0D0E]">
                               {progress}%
                            </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0C0D0E]">Ваш прогресс</h2>
                <p className="text-[rgb(12,13,14,0.52)]">Открыто <span
                  className="font-semibold text-[#007AFF]">{unlockedCount}</span> из <span
                  className="font-semibold">{totalCount}</span> достижений</p>
              </div>
            </section>

            {unlockedCount === 0 ? (
              <EmptyState
                Icon={EmptyShelfIllustrationIcon}
                title="Ваш путь героя начинается!"
                subtitle="Совершайте добрые дела, и здесь появится ваша коллекция наград."
                action={{
                  text: 'К списку возможностей',
                  onClick: onFindEvent,
                  type: 'primary'
                }}
              />
            ) : (
              <>
                <section>
                  <h3 className="text-xl font-bold text-[#0C0D0E] mb-4">Полученные</h3>
                  <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                    {unlockedAchievements.map(ach => (
                      <button key={ach.id} onClick={() => setSelectedAchievement(ach)}
                              className="transition-transform active:scale-95">
                        <AchievementBadge achievement={ach}/>
                      </button>
                    ))}
                  </div>
                </section>
                {lockedAchievements.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold text-[#0C0D0E] mb-4">Еще можно открыть</h3>
                    <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                      {lockedAchievements.map(ach => (
                        <button key={ach.id} onClick={() => setSelectedAchievement(ach)}
                                className="transition-transform active:scale-95">
                          <AchievementBadge achievement={ach}/>
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </main>

      <AchievementDetailModal
        achievement={selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        onNavigateWithFilter={handleNavigateWithFilter}
      />
    </div>
  );
};

export default AllAchievementsPage;