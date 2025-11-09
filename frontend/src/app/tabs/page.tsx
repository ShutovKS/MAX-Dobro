import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  BinocularsIllustrationIcon,
  CalendarIcon,
  FilterIcon,
  GeolocationIcon,
  ListIcon,
  LocationMarkerIcon,
  MagnifyingGlassIllustrationIcon,
  SearchIcon,
  ServerErrorIcon,
  SparklesIcon,
  XIcon
} from '../../components/ui/icons';
import EmptyState from '../../components/ui/EmptyState';
import {allCategories, defaultFilters} from '../../lib/mockData';
import {fetchAllEvents, fetchAllStories} from '../../lib/api';
import type {AppEvent, FilterDate, FilterFormat, Filters, Story} from '../../lib/types';
import SkeletonCard from '../../components/ui/SkeletonCard';
import EventCard from '../../components/ui/EventCard';

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
            <section>
              <h3 className="text-lg font-bold text-[#0C0D0E] mb-3">Формат</h3>
              <div className="flex bg-gray-100 rounded-xl p-1">
                {(['Все', 'Офлайн', 'Онлайн'] as FilterFormat[]).map(f => (
                  <button key={f} onClick={() => setFormat(f)}
                          className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${format === f ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </section>
            <section>
              <h3 className="text-lg font-bold text-[#0C0D0E] mb-3">Категории</h3>
              <div className="flex flex-wrap gap-2">
                {allCategories.map(cat => (
                  <button key={cat} onClick={() => toggleCategory(cat)}
                          className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${selectedCategories.includes(cat) ? 'bg-[#007AFF] text-white border-transparent' : 'bg-white text-[#007AFF] border-[#007AFF]/50'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </section>
            <section>
              <h3 className="text-lg font-bold text-[#0C0D0E] mb-3">Дата</h3>
              <div className="flex bg-gray-100 rounded-xl p-1 mb-3">
                {(['Любая', 'Сегодня', 'На неделе'] as FilterDate[]).map(d => (
                  <button key={d} onClick={() => setDate(d)}
                          className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${date === d ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>
                    {d}
                  </button>
                ))}
              </div>
              <button
                className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                <CalendarIcon className="w-5 h-5"/>
                <span>Выбрать даты</span>
              </button>
            </section>
            <section>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-[#0C0D0E]">Расстояние</h3>
                <span className="font-semibold text-[#0C0D0E]">до {distance} км</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-[#007AFF]"
              />
            </section>
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

const Header: React.FC<{
  onFilterClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}> = ({onFilterClick, searchQuery, onSearchChange}) => (
  <header className="absolute top-0 left-0 right-0 p-4 z-40">
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md flex items-center px-4 py-2">
      <SearchIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0"/>
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Поиск событий"
          className="w-full bg-transparent focus:outline-none text-[#0C0D0E] placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                  aria-label="Очистить поиск">
            <XIcon className="w-5 h-5"/>
          </button>
        )}
      </div>
      <button onClick={onFilterClick} aria-label="Фильтры" className="ml-2 flex-shrink-0">
        <FilterIcon className="w-6 h-6 text-gray-600"/>
      </button>
    </div>
  </header>
);

const SearchResultsInfo: React.FC<{ count: number; query: string; onReset: () => void; }> = ({
                                                                                               count,
                                                                                               query,
                                                                                               onReset
                                                                                             }) => (
  <div
    className="absolute top-24 left-4 right-4 bg-gray-100 p-3 rounded-xl flex justify-between items-center z-30 shadow-sm animate-fade-in-down">
    <p className="text-sm text-gray-700">Найдено {count} по запросу: <span
      className="font-semibold text-[#0C0D0E]">"{query}"</span></p>
    <button onClick={onReset} className="text-sm font-semibold text-[#007AFF] hover:underline">
      Сбросить
    </button>
    <style>{`
          @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-fade-in-down { animation: fade-in-down 0.3s ease-out; }
        `}</style>
  </div>
);

const MapScreen: React.FC<{
  events: AppEvent[],
  onSwitchView: () => void;
  isSearchActive: boolean;
  onResetSearch: () => void;
  onResetFilters: () => void;
}> = ({events, onSwitchView, isSearchActive, onResetSearch, onResetFilters}) => {

  return (
    <div className="w-full h-full">
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3Aa4ce07ce9e1982fdf2ff91bcaab73d5e7813568038d64c30469157376330f447&amp;source=constructor"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Яндекс Карта событий"
        ></iframe>
      </div>

      {events.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 p-4 bg-white/80 backdrop-blur-sm">
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
      )}

      <div className="absolute top-24 right-4 z-40 space-y-3">
        <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg"
                aria-label="Найти меня"><GeolocationIcon className="w-7 h-7 text-[#007AFF]"/></button>
        <button onClick={onSwitchView}
                className="w-14 h-14 bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] rounded-full flex items-center justify-center shadow-lg"
                aria-label="Переключить на список"><ListIcon className="w-7 h-7 text-white"/></button>
        <button
          onClick={() => window.location.hash = '#/chat'}
          className="w-14 h-14 bg-[linear-gradient(155deg,#BF97FF_6.6%,#526EFF_84.12%)] rounded-full flex items-center justify-center shadow-lg"
          aria-label="Открыть Помощника Добра"
        >
          <SparklesIcon className="w-7 h-7 text-white"/>
        </button>
      </div>
    </div>
  );
};

const FeedScreen: React.FC<{
  events: AppEvent[],
  loading: boolean;
  onSwitchView: () => void;
  isSearchActive: boolean;
  onResetSearch: () => void;
  onResetFilters: () => void;
  stories: Story[];
}> = ({events, loading, onSwitchView, isSearchActive, onResetSearch, onResetFilters, stories}) => {

  const onSelectEvent = (id: number) => {
    window.location.hash = `#/events/${id}`;
  };

  const onSelectStory = (id: number) => {
    window.location.hash = `#/stories/${id}`;
  };

  return (
    <div className={`w-full bg-gray-50 transition-all duration-300 ${isSearchActive ? 'pt-40' : 'pt-24'}`}>
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

      <div className="absolute top-24 right-4 z-40 space-y-3">
        <button onClick={onSwitchView}
                className="w-14 h-14 bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] rounded-full flex items-center justify-center shadow-lg"
                aria-label="Переключить на карту">
          <LocationMarkerIcon className="w-7 h-7 text-white"/>
        </button>
        <button
          onClick={() => window.location.hash = '#/chat'}
          className="w-14 h-14 bg-[linear-gradient(155deg,#BF97FF_6.6%,#526EFF_84.12%)] rounded-full flex items-center justify-center shadow-lg"
          aria-label="Открыть Помощника Добра"
        >
          <SparklesIcon className="w-7 h-7 text-white"/>
        </button>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [view, setView] = useState<'map' | 'feed'>('map');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [allEvents, setAllEvents] = useState<AppEvent[]>([]);
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const events = await fetchAllEvents();
      setAllEvents(events);
    } catch (err) {
      setError("Не удалось загрузить события. Проверьте ваше интернет-соединение и попробуйте снова.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
    const loadStories = async () => {
      try {
        const stories = await fetchAllStories();
        setAllStories(stories.slice(0, 5));
      } catch (err) {
        console.error("Failed to load stories for carousel");
      }
    };
    loadStories();
  }, [loadEvents]);

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

  const handleApplyFilters = (newFilters: Filters) => {
    setAppliedFilters(newFilters);
    setIsFilterPanelOpen(false);
  };

  const handleResetFilters = () => setAppliedFilters(defaultFilters);
  const isSearchActive = searchQuery.length > 0;

  if (error && !loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <EmptyState Icon={ServerErrorIcon} title="Что-то пошло не так" subtitle={error}
                    action={{text: 'Попробовать снова', onClick: loadEvents, type: 'primary'}}/>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Header onFilterClick={() => setIsFilterPanelOpen(true)} searchQuery={searchQuery}
              onSearchChange={setSearchQuery}/>
      {isSearchActive && (
        <SearchResultsInfo count={filteredEvents.length} query={searchQuery} onReset={() => setSearchQuery('')}/>)}
      {view === 'map' ? (
        <MapScreen events={filteredEvents} onSwitchView={() => setView('feed')} isSearchActive={isSearchActive}
                   onResetSearch={() => setSearchQuery('')} onResetFilters={handleResetFilters}/>
      ) : (
        <FeedScreen
          events={filteredEvents}
          loading={loading}
          onSwitchView={() => setView('map')}
          isSearchActive={isSearchActive}
          onResetSearch={() => setSearchQuery('')}
          onResetFilters={handleResetFilters}
          stories={allStories}
        />
      )}
      <FilterPanel isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)} onApply={handleApplyFilters}
                   initialFilters={appliedFilters} eventCount={filteredEvents.length}/>
    </div>
  );
};

export default HomePage;