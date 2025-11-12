import React, {useEffect, useState} from 'react';
import type {HistoryEvent} from '../../../lib/types';
import {Star, X} from 'lucide-react';

const quickTags = ["👍 Отличная организация", "🤝 Дружелюбная атмосфера", "😊 Было весело", "👎 Было скучно", "🤔 Непонятные задачи"];

const ReviewModal: React.FC<{
  isOpen: boolean;
  event: HistoryEvent | null;
  onClose: () => void;
  onSubmit: () => void;
}> = ({isOpen, event, onClose, onSubmit}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating > 0) {
      // In a real app, you would send the rating, comment, and tags to a server
      onSubmit();
    }
  };

  // Reset state on close to ensure it's fresh for the next review
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setRating(0);
        setComment('');
        setSelectedTags([]);
      }, 300); // delay to allow closing animation
    }
  }, [isOpen]);

  if (!isOpen || !event) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-title"
    >
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{height: '80vh', maxHeight: '700px'}}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="w-12"></div>
          {/* Spacer */}
          <div className="text-center">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-2"></div>
            <h2 id="review-title" className="text-xl font-bold text-[#0C0D0E]">Как все прошло?</h2>
          </div>
          <button onClick={onClose}
                  className="w-12 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800"
                  aria-label="Закрыть">
            <X className="w-6 h-6"/>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          {/* Rating Block */}
          <section className="text-center">
            <h3 className="font-semibold text-gray-700 mb-3">Ваша общая оценка</h3>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => handleRating(star)}
                        className="transform transition-transform active:scale-90">
                  <Star
                    className={`w-12 h-12 transition-colors ${rating >= star ? 'text-[#FF9315] fill-current' : 'text-gray-300'}`}/>
                </button>
              ))}
            </div>
          </section>

          {/* Quick Tags Block */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-3 text-center">Что вам понравилось?</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {quickTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${selectedTags.includes(tag) ? 'bg-[#007AFF] text-white border-transparent' : 'bg-white text-[#007AFF] border-[#007AFF]/50'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* Comment Field */}
          <section>
            <label htmlFor="comment" className="font-semibold text-gray-700 mb-3 block text-center">Ваш
              комментарий</label>
            <div className="relative">
                            <textarea
                              id="comment"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Расскажите подробнее (необязательно)"
                              rows={5}
                              maxLength={500}
                              className="w-full p-4 bg-gray-100 text-gray-900 placeholder-gray-500 border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                            />
              <span className="absolute bottom-2 right-3 text-xs text-gray-400">{comment.length}/500</span>
            </div>
          </section>
        </div>

        {/* Sticky Footer */}
        <footer className="p-4 border-t border-gray-100 flex-shrink-0 bg-white">
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#007AFF] hover:bg-blue-600"
          >
            Отправить отзыв
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ReviewModal;