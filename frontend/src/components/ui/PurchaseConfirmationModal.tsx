import React from 'react';
import {Sparkles} from 'lucide-react';

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  rewardName: string;
  rewardPrice: number;
  userKarma: number;
}

const PurchaseConfirmationModal: React.FC<PurchaseConfirmationModalProps> = ({
                                                                               isOpen,
                                                                               onConfirm,
                                                                               onCancel,
                                                                               rewardName,
                                                                               rewardPrice,
                                                                               userKarma
                                                                             }) => {
  if (!isOpen) return null;

  const remainingKarma = userKarma - rewardPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" role="dialog"
         aria-modal="true" aria-labelledby="purchase-title">
      <div
        className="bg-white rounded-[20px] shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-6 animate-scale-in">
        <h2 id="purchase-title" className="text-2xl font-bold text-[#0C0D0E]">Подтвердите покупку</h2>

        <div className="w-full text-left text-base space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Товар:</span>
            <span className="font-semibold text-[#0C0D0E]">{rewardName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Стоимость:</span>
            <div className="flex items-center space-x-1 font-semibold text-[#0C0D0E]">
              <Sparkles className="w-4 h-4 text-gray-500"/>
              <span>{rewardPrice.toLocaleString('ru-RU')}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Ваш баланс:</span>
            <div className="flex items-center space-x-1 font-semibold text-[#0C0D0E]">
              <Sparkles className="w-4 h-4 text-gray-500"/>
              <span>{userKarma.toLocaleString('ru-RU')}</span>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-3">
            <span className="text-gray-500">Останется:</span>
            <div className="flex items-center space-x-1 font-bold text-[#0C0D0E]">
              <Sparkles className="w-4 h-4 text-gray-500"/>
              <span>{remainingKarma.toLocaleString('ru-RU')}</span>
            </div>
          </div>
        </div>

        <div className="w-full flex space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-transparent text-[#007AFF] font-semibold py-3 px-4 rounded-[12px] hover:bg-gray-100 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#007AFF] text-white font-bold py-3 px-4 rounded-[12px] shadow-lg hover:bg-blue-600 transition-opacity"
          >
            Купить
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmationModal;