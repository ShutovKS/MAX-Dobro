import React, {useMemo, useState} from 'react';
import {useNavigate} from 'react-router';
import type {RewardItem, User} from '../../../lib/types';
import {ArrowLeft, CheckCircle, Sparkles} from 'lucide-react';
import {EmptyShelfIllustrationIcon} from '../../../components/ui/icons';
import EmptyState from '../../../components/ui/EmptyState';
import {REWARD_CATEGORIES} from '../../../lib/constants';

const RewardCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm p-3 animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-xl mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const RewardCard: React.FC<{ reward: RewardItem; onSelect: () => void; }> = ({reward, onSelect}) => {
  return (
    <button onClick={onSelect}
            className="bg-white rounded-2xl shadow-sm p-3 text-left w-full transition-transform active:scale-95">
      <div className="relative aspect-square mb-2">
        <img src={reward.imageUrl} alt={reward.name} className="w-full h-full object-cover rounded-xl"/>
        {reward.isPurchased && (
          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white/80"/>
          </div>
        )}
      </div>
      <h3 className="font-bold text-[#0C0D0E] truncate">{reward.name}</h3>
      <div className="flex items-center space-x-1 font-bold text-[#007AFF]">
        <Sparkles className="w-5 h-5"/>
        <span>{reward.price.toLocaleString('ru-RU')}</span>
      </div>
    </button>
  );
};

interface RewardsStorePageProps {
  user: User;
  rewards: RewardItem[];
  onBack: () => void;
}

const RewardsStorePage: React.FC<RewardsStorePageProps> = ({user, rewards, onBack}) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<typeof REWARD_CATEGORIES[number]>('Все');

  const onSelectReward = (reward: RewardItem) => {
    navigate(`/rewards/${reward.id}`);
  };

  const karmaBalance = useMemo(() => {
    const karmaStat = user.stats.find(s => s.id === 'karma');
    return karmaStat ? parseInt(karmaStat.value.replace(/,/g, ''), 10) : 0;
  }, [user.stats]);

  const filteredRewards = useMemo(() => {
    if (selectedCategory === 'Все') return rewards;
    return rewards.filter(r => r.category === selectedCategory);
  }, [selectedCategory, rewards]);

  const loading = rewards.length === 0;

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center">
        <button onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-2xl font-bold text-[#0C0D0E] mx-auto">Магазин наград</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-6 space-y-6">
        <section
          className="bg-[linear-gradient(155deg,#BF97FF_6.6%,#526EFF_84.12%)] text-white rounded-2xl shadow-lg p-6 text-center">
          <p className="font-semibold opacity-80">Ваш баланс:</p>
          <div className="flex items-center justify-center space-x-2 mt-1">
            <Sparkles className="w-8 h-8 text-yellow-300"/>
            <span className="text-4xl font-bold">{karmaBalance.toLocaleString('ru-RU')}</span>
          </div>
        </section>

        <section>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {REWARD_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-[#007AFF] text-white' : 'bg-white text-[#0C0D0E] shadow-sm'}`}>
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section>
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              <RewardCardSkeleton/>
              <RewardCardSkeleton/>
              <RewardCardSkeleton/>
              <RewardCardSkeleton/>
            </div>
          ) : filteredRewards.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredRewards.map(reward => (
                <RewardCard key={reward.id} reward={reward} onSelect={() => onSelectReward(reward)}/>
              ))}
            </div>
          ) : (
            <EmptyState
              Icon={EmptyShelfIllustrationIcon}
              title="Новые награды уже в пути!"
              subtitle="Загляните сюда позже, мы постоянно добавляем что-то интересное."
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default RewardsStorePage;
