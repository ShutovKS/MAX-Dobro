import React, {useEffect, useState} from 'react';
import type {HistoryEvent} from '../../../lib/types';
import {createStory, fetchActivityHistoryEvents} from '../../../lib/api';
import {Plus, X} from 'lucide-react';
import SelectEventModal from './SelectEventModal';

interface CreateStoryPageProps {
  onCancel: () => void;
  onPublish: (storyData: { event: HistoryEvent; text: string; photos: string[] }) => void;
  initialEventId: string | null;
}

const CreateStoryPage: React.FC<CreateStoryPageProps> = ({onCancel, onPublish, initialEventId}) => {
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  useEffect(() => {
    if (initialEventId) {
      const loadInitialEvent = async () => {
        const events = await fetchActivityHistoryEvents();
        const event = events.find(e => e.id === parseInt(initialEventId));
        if (event) setSelectedEvent(event);
      };
      loadInitialEvent();
    }
  }, [initialEventId]);

  const isPublishEnabled = !!selectedEvent && text.trim().length > 0 && photos.length > 0;

  const handleAddPhoto = () => {
    const newPhoto = `https://picsum.photos/seed/${Date.now()}/600/400`;
    setPhotos(prev => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handlePublishClick = async () => {
    if (isPublishEnabled && selectedEvent) {
      await createStory(selectedEvent.id, text, photos[0]);
      onPublish({
        event: selectedEvent,
        text,
        photos,
      });
    }
  };

  return (
    <>
      <div className="w-full h-screen font-sans antialiased bg-white flex flex-col">
        <header className="flex-shrink-0 p-4 border-b border-gray-200 flex items-center justify-between">
          <button onClick={onCancel} className="text-lg font-medium text-[#007AFF]">Отмена</button>
          <h1 className="text-lg font-bold text-[#0C0D0E]">Новая история</h1>
          <button
            onClick={handlePublishClick}
            disabled={!isPublishEnabled}
            className={`text-lg font-bold ${isPublishEnabled ? 'text-[#007AFF]' : 'text-gray-400'}`}
          >
            Опубликовать
          </button>
        </header>

        <main className="flex-grow overflow-y-auto p-4 space-y-4">
          <section className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
            <p className="text-sm text-gray-700 flex-1 truncate">
              История о событии: <span
              className="font-semibold text-[#0C0D0E]">{selectedEvent?.title || 'Не выбрано'}</span>
            </p>
            <button onClick={() => setIsEventModalOpen(true)}
                    className="ml-2 text-sm font-semibold text-[#007AFF] hover:underline">
              {selectedEvent ? 'Изменить' : 'Выбрать'}
            </button>
          </section>

          <section>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {photos.map((photoUrl, index) => (
                <div key={index} className="relative flex-shrink-0 w-28 h-28">
                  <img src={photoUrl} alt={`Upload preview ${index + 1}`}
                       className="w-full h-full object-cover rounded-lg"/>
                  <button onClick={() => handleRemovePhoto(index)}
                          className="absolute -top-1 -right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          aria-label="Удалить фото">
                    <X className="w-4 h-4"/>
                  </button>
                </div>
              ))}
              <button onClick={handleAddPhoto}
                      className="flex-shrink-0 w-28 h-28 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <Plus className="w-8 h-8" strokeWidth={3}/>
                <span className="text-xs font-semibold mt-1">Добавить фото</span>
              </button>
            </div>
          </section>

          <section className="flex-grow flex">
                        <textarea
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Расскажите, как все прошло..."
                          className="w-full h-full min-h-[200px] bg-transparent text-lg text-[#0C0D0E] placeholder-gray-400 focus:outline-none resize-none"
                        />
          </section>
        </main>
      </div>
      <SelectEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSelect={(event) => {
          setSelectedEvent(event);
          setIsEventModalOpen(false);
        }}
      />
    </>
  );
};

export default CreateStoryPage;
