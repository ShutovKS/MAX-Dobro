import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {fetchAllStories} from '../../../lib/api';
import type {Story} from '../../../lib/types';
import {Plus} from 'lucide-react';
import {PhotoAlbumIllustrationIcon} from '../../../components/ui/icons';
import EmptyState from '../../../components/ui/EmptyState';
import StoryCard from './components/StoryCard';
import StorySkeletonCard from './components/StorySkeletonCard';

const StoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        const fetchedStories = await fetchAllStories();
        setStories(fetchedStories);
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить истории.");
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  const onStartCreateStory = () => {
    navigate('/app/stories/create');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <StorySkeletonCard/>
          <StorySkeletonCard/>
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    if (stories.length === 0) {
      return (
        <EmptyState
          Icon={PhotoAlbumIllustrationIcon}
          title="Лента пока пуста"
          subtitle="Станьте первым, кто расскажет о своем волонтерском опыте и вдохновит других!"
          action={{
            text: 'Рассказать свою историю',
            onClick: onStartCreateStory,
            type: 'primary'
          }}
        />
      );
    }

    return (
      <div className="space-y-4">
        {stories.map(story => (
          <StoryCard key={story.id} story={story}/>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#F0F0F0] min-h-full relative">
      <header className="p-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-[28px] font-bold text-[#0C0D0E]">Истории</h1>
        <button
          onClick={onStartCreateStory}
          className="w-12 h-12 bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] rounded-full flex items-center justify-center shadow-lg"
          aria-label="Создать историю"
        >
          <Plus className="w-6 h-6 text-white" strokeWidth={3}/>
        </button>
      </header>

      <main className="p-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default StoriesPage;