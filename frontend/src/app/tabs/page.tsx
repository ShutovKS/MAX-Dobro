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
import {EVENT_CATEGORIES, FILTER_DATE_OPTIONS, FILTER_FORMAT_OPTIONS, UI_TEXT} from '../../lib/constants';
import {parseRuDateToDate} from '../../lib/dateUtils';

const defaultFilters: Filters = {
  format: 'Все',
  categories: [],
  date: 'Любая',
  distance: 50,
};

const getDistance = (from: [number, number], to: [number, number]): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (to[0] - from[0]) * Math.PI / 180;
  const dLon = (to[1] - from[1]) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from[0] * Math.PI / 180) * Math.cos(to[0] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const applyAllFilters = (
  events: AppEvent[],
  markers: MapMarker[],
  filters: Filters,
  userLocation: [number, number]
): AppEvent[] => {
  const markersMap = new Map(markers.map(m => [m.id, m.position]));

  return events.filter(event => {
    const {format, categories, date, distance} = filters;

    // Format match
    const formatMatch = format === 'Все' || (format === 'Онлайн' ? event.location === 'Онлайн' : event.location !== 'Онлайн');
    if (!formatMatch) return false;

    // Category match
    const categoryMatch = categories.length === 0 || categories.includes(event.category);
    if (!categoryMatch) return false;

    // Date match
    const dateMatch = (() => {
      if (date === 'Любая') return true;
      const eventDate = parseRuDateToDate(event.date);
      if (!eventDate) return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (date === 'Сегодня') {
        return eventDate.toDateString() === today.toDateString();
      }

      if (date === 'На неделе') {
        const endOfWeek = new Date(today);
        const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1; // Monday is 0, Sunday is 6
        endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
        endOfWeek.setHours(23, 59, 59, 999);
        return eventDate >= today && eventDate <= endOfWeek;
      }
      return true;
    })();
    if (!dateMatch) return false;

    // Distance match (только для офлайн-событий, у которых есть координаты).
    // События без координат НЕ скрываем (иначе лента/карта пустеют, если у
    // события не проставлены lat/lng).
    if (format !== 'Онлайн') {
      const eventPosition = markersMap.get(event.id);
      if (eventPosition) {
        const eventDistance = getDistance(userLocation, eventPosition);
        if (eventDistance > distance) {
          return false;
        }
      }
    }

    return true;
  });
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
  allEvents: AppEvent[];
  allMarkers: MapMarker[];
  userLocation: [number, number];
}> = ({isOpen, onClose, onApply, initialFilters, allEvents, allMarkers, userLocation}) => {
  const [format, setFormat] = useState<FilterFormat>(initialFilters.format);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories);
  const [date, setDate] = useState<FilterDate>(initialFilters.date);
  const [distance, setDistance] = useState(initialFilters.distance);

  useEffect(() => {
    if (isOpen) {
      setFormat(initialFilters.format);
      setSelectedCategories(initialFilters.categories);
      setDate(initialFilters.date);
      setDistance(initialFilters.distance);
    }
  }, [isOpen, initialFilters]);

  const previewEventCount = useMemo(() => {
    const currentFilters: Filters = {
      format,
      categories: selectedCategories,
      date,
      distance,
    };
    return applyAllFilters(allEvents, allMarkers, currentFilters, userLocation).length;
  }, [format, selectedCategories, date, distance, allEvents, allMarkers, userLocation]);

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
      className={`fixed inset-0 z-[1001] transition-colors duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}>
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
                {FILTER_FORMAT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFormat(opt as FilterFormat)}
                    className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      format === opt ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0C0D0E] mb-3">Категории</h3>
              <div className="flex flex-wrap gap-2">
                {EVENT_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${
                      selectedCategories.includes(cat)
                        ? 'bg-[#007AFF] text-white border-transparent'
                        : 'bg-white text-[#007AFF] border-[#007AFF]/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#0C0D0E] mb-3">Дата</h3>
              <div className="flex bg-gray-100 rounded-xl p-1">
                {FILTER_DATE_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDate(d as FilterDate)}
                    className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      date === d ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </section>

            {format !== 'Онлайн' && (
              <section>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-[#0C0D0E]">Расстояние</h3>
                  <span className="font-semibold text-gray-700">до {distance} км</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#007AFF]"
                />
              </section>
            )}
          </div>

          <footer className="p-4 border-t border-gray-200 flex-shrink-0">
            <button onClick={handleApply}
                    className="w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] hover:opacity-90 shadow-lg">
              Показать {previewEventCount} событий
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
  const [userLocation] = useState<[number, number]>([55.751244, 37.618423]); // Mock user location (Moscow Center)

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
    const baseFiltered = applyAllFilters(allEvents, allMarkers, appliedFilters, userLocation);
    if (!searchQuery) return baseFiltered;
    return baseFiltered.filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [appliedFilters, searchQuery, allEvents, allMarkers, userLocation]);

  const filteredMarkers = useMemo(() => {
    const eventIds = new Set(filteredEvents.map(e => e.id));
    return allMarkers.filter(m => eventIds.has(m.id));
  }, [filteredEvents, allMarkers]);

  const handleApplyFilters = (newFilters: Filters) => {
    setAppliedFilters(newFilters);
    setIsFilterPanelOpen(false);
  };

  const handleResetFilters = () => setAppliedFilters(defaultFilters);
  const onSelectEvent = (id: number) => navigate(`/app/events/${id}`);
  const onSelectStory = (id: number) => navigate(`/app/stories/${id}`);
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
            onClick={() => navigate('/app/chat')}
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

      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={appliedFilters}
        allEvents={allEvents}
        allMarkers={allMarkers}
        userLocation={userLocation}
      />
    </div>
  );
};