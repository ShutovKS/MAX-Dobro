// FILE: frontend/src/app/stories/create/page.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Compose and publish a volunteer story with photos and a linked event.
//   SCOPE: Event pick, image upload, text, createStory
//   DEPENDS: M-FRONTEND-API, M-FRONTEND-UI, M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   CreateStoryPage - new story composer
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, {useEffect, useRef, useState} from 'react';
import type {HistoryEvent} from '../../../lib/types';
import {createStory, fetchActivityHistoryEvents} from '../../../lib/api';
import {uploadImage} from '../../../lib/upload';
import {Loader2, Plus, X} from 'lucide-react';
import SelectEventModal from './SelectEventModal';

interface CreateStoryPageProps {
  onCancel: () => void;
  onPublish: (storyData: { event: HistoryEvent; text: string; photos: string[] }) => void;
  initialEventId: string | null;
}

// START_CONTRACT: CreateStoryPage
//   PURPOSE: Collect event, photos, and text then publish a story
//   INPUTS: { onCancel: () => void; onPublish: (storyData) => void; initialEventId: string | null }
//   OUTPUTS: { ReactElement - composer plus SelectEventModal }
//   SIDE_EFFECTS: uploadImage, createStory, fetchActivityHistoryEvents
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS, fn-createStory
// END_CONTRACT: CreateStoryPage
const CreateStoryPage: React.FC<CreateStoryPageProps> = ({onCancel, onPublish, initialEventId}) => {
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // START_BLOCK_LOAD_INITIAL_EVENT
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
  // END_BLOCK_LOAD_INITIAL_EVENT

  const isPublishEnabled = !!selectedEvent && text.trim().length > 0 && photos.length > 0;

  const handleAddPhotoClick = () => {
    setUploadError('');
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ''; // позволяем выбрать тот же файл повторно
    if (files.length === 0) return;
    setUploadError('');
    setIsUploading(true);
    try {
      const urls = await Promise.all(files.map((file) => uploadImage(file)));
      setPhotos(prev => [...prev, ...urls]);
    } catch (err: any) {
      setUploadError(err.message || 'Не удалось загрузить фото');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // START_BLOCK_PUBLISH_STORY
  const handlePublishClick = async () => {
    if (isPublishEnabled && selectedEvent && !isPublishing) {
      setIsPublishing(true);
      try {
        await createStory(selectedEvent.id, text, photos[0]);
        onPublish({event: selectedEvent, text, photos});
      } catch (err: any) {
        setUploadError(err.message || 'Не удалось опубликовать историю');
        setIsPublishing(false);
      }
    }
  };
  // END_BLOCK_PUBLISH_STORY

  // START_BLOCK_RENDER_COMPOSER
  return (
    <>
      <div className="w-full h-screen font-sans antialiased bg-white flex flex-col">
        <header className="flex-shrink-0 p-4 border-b border-gray-200 flex items-center justify-between">
          <button onClick={onCancel} className="text-lg font-medium text-[#007AFF]">Отмена</button>
          <h1 className="text-lg font-bold text-[#0C0D0E]">Новая история</h1>
          <button
            onClick={handlePublishClick}
            disabled={!isPublishEnabled || isPublishing}
            className={`text-lg font-bold ${isPublishEnabled && !isPublishing ? 'text-[#007AFF]' : 'text-gray-400'}`}
          >
            {isPublishing ? 'Публикация…' : 'Опубликовать'}
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
              <button onClick={handleAddPhotoClick} disabled={isUploading}
                      className="flex-shrink-0 w-28 h-28 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-60">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin"/>
                ) : (
                  <Plus className="w-8 h-8" strokeWidth={3}/>
                )}
                <span className="text-xs font-semibold mt-1">{isUploading ? 'Загрузка…' : 'Добавить фото'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
              />
            </div>
            {uploadError && (
              <p className="text-red-600 text-sm mt-2">{uploadError}</p>
            )}
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
  // END_BLOCK_RENDER_COMPOSER
};

export default CreateStoryPage;
