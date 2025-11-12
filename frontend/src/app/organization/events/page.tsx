import React, {useEffect, useMemo, useState} from 'react';
import {fetchOrganizationEvents} from '../../../lib/api';
import type {OrganizationEvent} from '../../../lib/types';
import {ArrowLeft, List, Plus} from 'lucide-react';
import EventManagementCard from '../../../features/organization/components/EventManagementCard';
import EmptyState from '../../../components/ui/EmptyState';

// A simple skeleton card for loading state
const SkeletonCard = () => (
  <div className="w-full bg-white rounded-2xl p-4 shadow-sm animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-5 bg-gray-200 rounded w-3/5 mb-4"></div>
    <div className="flex justify-end border-t border-gray-100 pt-3 mt-3">
      <div className="h-9 w-32 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);


const EventManagementPage: React.FC<{
  onBack: () => void;
  onCreateEvent: () => void;
  onEditEvent: (event: OrganizationEvent) => void;
  onManageParticipants: (event: OrganizationEvent) => void;
}> = ({onBack, onCreateEvent, onEditEvent, onManageParticipants}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'past' | 'drafts'>('active');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<OrganizationEvent[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const data = await fetchOrganizationEvents();
      setEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (activeTab === 'drafts') return event.status === 'draft';
      return event.status === activeTab;
    });
  }, [activeTab, events]);

  const handleMore = (id: number) => console.log(`More options for event ${id}`);
  const handleSelect = (event: OrganizationEvent) => onManageParticipants(event);
  const handleCreate = () => onCreateEvent();

  const renderEmptyState = () => {
    switch (activeTab) {
      case 'active':
        return (
          <EmptyState
            Icon={List}
            title="У вас пока нет активных событий"
            subtitle="Создайте ваше первое событие, чтобы привлечь волонтеров и сделать доброе дело."
            action={{text: 'Создать событие', onClick: handleCreate, type: 'primary'}}
          />
        );
      case 'past':
        return (
          <EmptyState
            Icon={List}
            title="Здесь будет архив"
            subtitle="Ваши завершенные мероприятия появятся в этом разделе."
          />
        );
      case 'drafts':
        return (
          <EmptyState
            Icon={List}
            title="Нет черновиков"
            subtitle="Здесь будут сохраняться ваши незаконченные события."
          />
        );
    }
  };

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header
        className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between">
        <button onClick={onBack}
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700"/>
        </button>
        <h1 className="text-2xl font-bold text-[#0C0D0E]">Мои события</h1>
        <button onClick={handleCreate}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
          <Plus className="w-6 h-6 text-gray-700"/>
        </button>
      </header>

      <nav className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button onClick={() => setActiveTab('active')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'active' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>Активные
          </button>
          <button onClick={() => setActiveTab('past')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'past' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>Прошедшие
          </button>
          <button onClick={() => setActiveTab('drafts')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'drafts' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>Черновики
          </button>
        </div>
      </nav>

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {loading ? (
          <>
            <SkeletonCard/>
            <SkeletonCard/>
            <SkeletonCard/>
          </>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventManagementCard
              key={event.id}
              event={event}
              onEdit={() => onEditEvent(event)}
              onMore={handleMore}
              onSelect={() => handleSelect(event)}
            />
          ))
        ) : (
          <div className="pt-10">{renderEmptyState()}</div>
        )}
      </main>
    </div>
  );
};

export default EventManagementPage;
