import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router';
import {Filter, List, MapPin as MapPinIcon, Search, ServerCrash, Sparkles, X} from 'lucide-react';
import {BinocularsIllustrationIcon, MagnifyingGlassIllustrationIcon} from '../../components/ui/icons';
import EmptyState from '../../components/ui/EmptyState';
import {fetchAllEvents, fetchAllStories, fetchMapMarkers} from '../../lib/api';
import type {AppEvent, FilterDate, FilterFormat, Filters, MapMarker, Story} from '../../lib/types';
import SkeletonCard from '../../components/ui/SkeletonCard';
import EventCard from '../../components/ui/EventCard';
import InteractiveMap from '../../components/ui/InteractiveMap';
import {UI_TEXT} from '../../lib/constants';

// FIX: Define defaultFilters locally as it is not exported from mockData, and remove the faulty import.
const defaultFilters: Filters = {
  format: 'Все',
  categories: [],
  date: 'Любая',
  distance: 5,
};

const StoryPreviewCard: React.FC<{ story: Story; onSelectStory: (id: number) => void }> = ({story, onSelectStory}) => (
  <div onClick={() => onSelectStory(story.id)} className="flex-shrink-0 w-40 space-y-2 cursor-pointer group">
    <div className="w-full h-48 overflow-hidden rounded-xl">
      <img src={story.imageUrl} alt={story.text}
           className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"/>
    </div>
    <div>
      <p className="text-xs font-bold truncate text-[#0C0D0E]">{story.author.name}</p>
      <p className="text-xs text-gray-500 truncate">{story.text}</p>
    </div>
  </div>
);

const StoriesCarousel: React.FC<{ stories: Story[]; onSelectStory: (id: number) => void }> = ({
                                                                                                stories,
                                                                                                onSelectStory
                                                                                              }) => (
  <section className="py-4 bg-gray-50 -mx-4 px-4">
    <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Лучшие истории</h2>
    <div className="flex space-x-4 overflow-x-auto pb-2 -mr-4">
      {stories.map(story => (
        <StoryPreviewCard key={story.id} story={story} onSelectStory={onSelectStory}/>
      ))}
    </div>
  </section>
);

const FilterPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  initialFilters: Filters;
  eventCount: number;
}> = ({isOpen, onClose, onApply, initialFilters, eventCount}) => {
  const [format, setFormat] = useState<FilterFormat>(initialFilters.format);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories);
  const [date, setDate] = useState<FilterDate>(initialFilters.date);
  const [distance, setDistance] = useState(initialFilters.distance);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleReset = () => {
    setFormat(defaultFilters.format);
    setSelectedCategories(defaultFilters.categories);
    setDate(defaultFilters.date);
    setDistance(defaultFilters.distance);
  };

  const handleApply = () => {
    onApply({format, categories: selectedCategories, date, distance});
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}>
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{height: '80vh'}}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-panel-title"
      >
        <div className="flex flex-col h-full">
          <header className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="w-10"></div>
            <div className="text-center">
              <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <h2 id="filter-panel-title" className="text-xl font-bold text-[#0C0D0E]">Фильтры</h2>
            </div>
            <button onClick={handleReset} className="text-sm font-semibold text-[#007AFF]">Сбросить</button>
          </header>

          <div className="flex-grow p-6 overflow-y-auto space-y-6">

          </div>

          <footer className="p-4 border-t border-gray-200 flex-shrink-0">
            <button onClick={handleApply}
                    className="w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] hover:opacity-90 shadow-lg">
              Показать {eventCount} событий
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

const SearchResultsInfo: React.FC<{ count: number; query: string; onReset: () => void; }> = ({
                                                                                               count,
                                                                                               query,
                                                                                               onReset
                                                                                             }) => (
  <div
    className="absolute top-36 left-4 right-4 bg-gray-100 p-3 rounded-xl flex justify-between items-center z-30 shadow-sm animate-fade-in-down">
    <p className="text-sm text-gray-700">Найдено {count} по запросу: <span
      className="font-semibold text-[#0C0D0E]">"{query}"</span></p>
    <button onClick={onReset} className="text-sm font-semibold text-[#007AFF] hover:underline">
      Сбросить
    </button>
  </div>
);

const MapScreen: React.FC<{
  markers: MapMarker[];
  onSelectEvent: (id: number) => void;
  isSearchActive: boolean;
  onResetSearch: () => void;
  onResetFilters: () => void;
}> = ({markers, onSelectEvent, isSearchActive, onResetSearch, onResetFilters}) => {
  if (markers.length === 0) {
    return (
      <div className="relative w-full h-full bg-gray-200">
        <div className="absolute inset-0 pt-36 flex items-center justify-center z-10 p-4 bg-white/80 backdrop-blur-sm">
          {isSearchActive ? (
            <EmptyState Icon={MagnifyingGlassIllustrationIcon} title="Ничего не найдено"
                        subtitle="Возможно, в запросе опечатка? Попробуйте переформулировать."
                        action={{text: "Сбросить поиск", onClick: onResetSearch, type: 'secondary'}}/>
          ) : (
            <EmptyState Icon={BinocularsIllustrationIcon} title="По этим фильтрам тихо"
                        subtitle="Попробуйте изменить параметры или расширить радиус поиска."
                        action={{text: "Сбросить фильтры", onClick: onResetFilters, type: 'secondary'}}/>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full pt-36">
      <InteractiveMap markers={markers} onMarkerClick={onSelectEvent}/>
    </div>
  );
};


const FeedScreen: React.FC<{
  events: AppEvent[],
  loading: boolean;
  isSearchActive: boolean;
  onResetSearch: () => void;
  onResetFilters: () => void;
  stories: Story[];
  onSelectEvent: (id: number) => void;
  onSelectStory: (id: number) => void;
}> = ({events, loading, isSearchActive, onResetSearch, onResetFilters, stories, onSelectEvent, onSelectStory}) => (
  <div className={`w-full bg-gray-50 transition-all duration-300 pt-36`}>
    <main className="px-4 space-y-4">
      {loading ? (<> <SkeletonCard/> <SkeletonCard/> <SkeletonCard/> </>)
        : (
          <>
            {stories.length > 0 && <StoriesCarousel stories={stories} onSelectStory={onSelectStory}/>}
            {events.length > 0 ? (
              events.map(event => (<button key={event.id} onClick={() => onSelectEvent(event.id)}
                                           className="w-full transition-transform duration-200 active:scale-95">
                <EventCard event={event}/></button>))
            ) : (
              isSearchActive ? (
                <EmptyState Icon={MagnifyingGlassIllustrationIcon} title="Ничего не найдено"
                            subtitle="Возможно, в запросе опечатка? Попробуйте переформулировать."
                            action={{text: "Сбросить поиск", onClick: onResetSearch, type: 'secondary'}}/>
              ) : (
                <EmptyState Icon={BinocularsIllustrationIcon} title="По этим фильтрам тихо"
                            subtitle="Попробуйте изменить параметры или расширить радиус поиска."
                            action={{text: "Сбросить фильтры", onClick: onResetFilters, type: 'secondary'}}/>
              )
            )}
          </>
        )}
    </main>
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const [view, setView] = useState<'map' | 'feed'>('map');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [allEvents, setAllEvents] = useState<AppEvent[]>([]);
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [allMarkers, setAllMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [events, stories, markers] = await Promise.all([
          fetchAllEvents(),
          fetchAllStories(),
          fetchMapMarkers()
        ]);
        setAllEvents(events);
        setAllStories(stories.slice(0, 5));
        setAllMarkers(markers);
      } catch (err) {
        setError("Не удалось загрузить данные. Проверьте ваше интернет-соединение и попробуйте снова.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredEvents = useMemo(() => {
    const baseFiltered = allEvents.filter(event => {
      const {format, categories} = appliedFilters;
      const formatMatch = format === 'Все' || (format === 'Онлайн' ? event.location === 'Онлайн' : event.location !== 'Онлайн');
      const categoryMatch = categories.length === 0 || categories.includes(event.category);
      return formatMatch && categoryMatch;
    });
    if (!searchQuery) return baseFiltered;
    return baseFiltered.filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [appliedFilters, searchQuery, allEvents]);

  const filteredMarkers = useMemo(() => {
    const eventIds = new Set(filteredEvents.map(e => e.id));
    return allMarkers.filter(m => eventIds.has(m.id));
  }, [filteredEvents, allMarkers]);

  const handleApplyFilters = (newFilters: Filters) => {
    setAppliedFilters(newFilters);
    setIsFilterPanelOpen(false);
  };

  const handleResetFilters = () => setAppliedFilters(defaultFilters);
  const onSelectEvent = (id: number) => navigate(`/events/${id}`);
  const onSelectStory = (id: number) => navigate(`/stories/${id}`);
  const isSearchActive = searchQuery.length > 0;

  if (error && !loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <EmptyState Icon={ServerCrash} title="Что-то пошло не так" subtitle={error}
                    action={{
                      text: 'Попробовать снова', onClick: () => {
                        window.location.reload();
                      }, type: 'primary'
                    }}/>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <header className="absolute top-0 left-0 right-0 p-4 z-40 space-y-3">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/chat')}
            className="bg-blue-100 text-blue-600 font-semibold py-2 px-4 rounded-full flex items-center space-x-2 shadow-sm transition-transform hover:scale-105 active:scale-95"
            aria-label="Открыть Помощника"
          >
            <Sparkles className="w-5 h-5"/>
            <span>{UI_TEXT.ASSISTANT_NAME}</span>
          </button>

          <div className="bg-gray-100 p-1 rounded-full flex items-center space-x-1 shadow-sm">
            <button
              onClick={() => setView('feed')}
              className={`px-4 py-1.5 rounded-full flex items-center space-x-2 text-sm font-semibold transition-all duration-200 ${
                view === 'feed' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
              }`}
              aria-pressed={view === 'feed'}
            >
              <List className="w-5 h-5"/>
              <span>Список</span>
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-4 py-1.5 rounded-full flex items-center space-x-2 text-sm font-semibold transition-all duration-200 ${
                view === 'map' ? 'bg-white text-[#007AFF] shadow-sm border border-gray-300' : 'text-gray-600'
              }`}
              aria-pressed={view === 'map'}
            >
              <MapPinIcon className="w-5 h-5"/>
              <span>Карта</span>
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md flex items-center px-4 py-2">
          <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0"/>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Поиск событий"
              className="w-full bg-transparent focus:outline-none text-[#0C0D0E] placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                      aria-label="Очистить поиск">
                <X className="w-5 h-5"/>
              </button>
            )}
          </div>
          <button onClick={() => setIsFilterPanelOpen(true)} aria-label="Фильтры" className="ml-2 flex-shrink-0">
            <Filter className="w-6 h-6 text-gray-600"/>
          </button>
        </div>
      </header>

      {isSearchActive && (
        <SearchResultsInfo count={filteredEvents.length} query={searchQuery} onReset={() => setSearchQuery('')}/>)}

      {view === 'map' ? (
        <MapScreen
          markers={filteredMarkers}
          onSelectEvent={onSelectEvent}
          isSearchActive={isSearchActive}
          onResetSearch={() => setSearchQuery('')}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <FeedScreen
          events={filteredEvents}
          loading={loading}
          isSearchActive={isSearchActive}
          onResetSearch={() => setSearchQuery('')}
          onResetFilters={handleResetFilters}
          stories={allStories}
          onSelectEvent={onSelectEvent}
          onSelectStory={onSelectStory}
        />
      )}

      <FilterPanel isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)} onApply={handleApplyFilters}
                   initialFilters={appliedFilters} eventCount={filteredEvents.length}/>
    </div>
  );
};
