import React, {useMemo, useState} from 'react';
import type {RewardItem, User} from '../../../../lib/types';
import {ArrowLeft, CheckCircle, Sparkles} from 'lucide-react';
import PurchaseConfirmationModal from '../../../../components/ui/PurchaseConfirmationModal';

interface RewardsDetailPageProps {
  rewardId: number;
  allRewards: RewardItem[];
  user: User;
  onPurchase: (rewardId: number) => void;
}

const RewardsDetailPage: React.FC<RewardsDetailPageProps> = ({rewardId, allRewards, user, onPurchase}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const reward = useMemo(() => allRewards.find(r => r.id === rewardId), [rewardId, allRewards]);

  const karmaBalance = useMemo(() => {
    const karmaStat = user.stats.find(s => s.id === 'karma');
    return karmaStat ? parseInt(karmaStat.value.replace(/,/g, ''), 10) : 0;
  }, [user.stats]);

  const onBack = () => window.location.hash = '#/profile/rewardsStore';

  if (!reward) {
    return <div className="w-full h-screen flex items-center justify-center">Награда не найдена.</div>;
  }

  const canAfford = karmaBalance >= reward.price;

  const handlePurchaseClick = () => {
    if (canAfford && !reward.isPurchased) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmPurchase = () => {
    onPurchase(reward.id);
    setIsConfirmModalOpen(false);
  };

  const renderFooterButton = () => {
    if (reward.isPurchased) {
      return (
        <div className="flex items-center justify-center space-x-2 font-semibold text-lg text-green-600 h-[52px]">
          <CheckCircle className="w-6 h-6"/>
          <span>Уже в коллекции</span>
        </div>
      );
    }

    if (!canAfford) {
      return (
        <button disabled className="w-full bg-gray-300 text-white font-bold py-4 px-4 rounded-xl cursor-not-allowed">
          Недостаточно баллов
        </button>
      );
    }

    return (
      <button onClick={handlePurchaseClick}
              className="w-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:opacity-90 transition-opacity">
        Купить
      </button>
    );
  };

  return (
    <>
      <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
        <header className="flex-shrink-0 p-4 bg-[#F0F0F0] flex items-center sticky top-0 z-10">
          <button onClick={onBack}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/90 shadow-sm"
                  aria-label="Назад">
            <ArrowLeft className="w-6 h-6 text-gray-700"/>
          </button>
          <h1 className="text-lg font-bold text-[#0C0D0E] mx-auto">Награда</h1>
          <div className="w-10"></div>
        </header>

        <main className="flex-grow overflow-y-auto px-6 pb-28">
          {/* Image Card */}
          <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
            <img src={reward.imageUrl} alt={reward.name} className="w-full aspect-square object-cover rounded-xl"/>
          </div>

          {/* Info */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#0C0D0E]">{reward.name}</h2>
            <p
              className="font-semibold text-gray-500">{reward.category === 'Значки' ? 'Эксклюзивный значок для профиля' : 'Тема оформления для приложения'}</p>
            <p className="text-gray-600 leading-relaxed pt-2">
              Это уникальная награда, которая покажет всем ваш вклад в добрые дела. Используйте ее, чтобы украсить свой
              профиль и вдохновить других!
            </p>
          </div>
        </main>

        <footer
          className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-500">Цена:</p>
              <div className="flex items-center space-x-1 font-bold text-lg text-[#0C0D0E]">
                <Sparkles className="w-5 h-5 text-[#007AFF]"/>
                <span>{reward.price.toLocaleString('ru-RU')}</span>
              </div>
            </div>
            <div className="w-2/3 max-w-[250px]">
              {renderFooterButton()}
            </div>
          </div>
        </footer>
      </div>

      <PurchaseConfirmationModal
        isOpen={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmPurchase}
        rewardName={reward.name}
        rewardPrice={reward.price}
        userKarma={karmaBalance}
      />
    </>
  );
};

export default RewardsDetailPage;
