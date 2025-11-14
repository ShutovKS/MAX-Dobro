import React, {useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router';
import {fetchEventParticipants, fetchOrganizationEvents} from '../../../../lib/api';
import type {EventParticipant, OrganizationEvent, User} from '../../../../lib/types';
import {ArrowLeft, MessageSquare, MoreHorizontal, Star, Users} from 'lucide-react';
import EmptyState from '../../../../components/ui/EmptyState';

type ParticipantTab = 'new' | 'confirmed' | 'rejected';

const ParticipantCell: React.FC<{
  participant: EventParticipant;
  tab: ParticipantTab;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}> = ({participant, tab, onAccept, onReject}) => {
  return (
    <div className="flex items-center space-x-4 p-4 w-full">
      <img src={participant.avatarUrl} alt={participant.name} className="w-12 h-12 rounded-full"/>
      <div className="flex-1">
        <p className="font-bold text-md text-[#0C0D0E]">{participant.name}</p>
        <div className="flex items-center text-sm text-[rgb(12,13,14,0.52)]">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1"/>
          <span>{participant.rating}</span>
        </div>
      </div>

      {tab === 'new' && (
        <div className="flex space-x-2">
          <button onClick={() => onReject(participant.id)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">Отклонить
          </button>
          <button onClick={() => onAccept(participant.id)}
                  className="px-4 py-2 rounded-lg bg-[#1ABE43]/20 text-[#1ABE43] font-semibold hover:bg-[#1ABE43]/30 transition-colors">Принять
          </button>
        </div>
      )}
      {tab === 'confirmed' && (
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg hover:bg-gray-200"><MessageSquare className="w-6 h-6 text-gray-600"/>
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-200"><MoreHorizontal className="w-6 h-6 text-gray-600"/>
          </button>
        </div>
      )}
      {tab === 'rejected' && (
        <p className="text-sm font-semibold text-gray-500">Заявка отклонена</p>
      )}
    </div>
  );
};

const ParticipantCellSkeleton: React.FC = () => (
  <div className="flex items-center space-x-4 p-4 w-full animate-pulse">
    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
    <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
  </div>
);

const EventParticipantsPage: React.FC<{
  user: User;
  onBack: () => void;
}> = ({user, onBack}) => {
  const {eventId} = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<OrganizationEvent | null>(null);
  const [activeTab, setActiveTab] = useState<ParticipantTab>('new');
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!eventId || !user.organizationId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const eventIdNum = parseInt(eventId, 10);
      try {
        // FIX: Pass user.organizationId to fetchOrganizationEvents as it's a required argument.
        const [allOrgEvents, participantsData] = await Promise.all([
          fetchOrganizationEvents(user.organizationId),
          fetchEventParticipants(eventIdNum)
        ]);
        const currentEvent = allOrgEvents.find(e => e.id === eventIdNum);
        setEvent(currentEvent || null);
        setParticipants(participantsData);
      } catch (error) {
        console.error("Failed to load event participants data", error);
        setEvent(null);
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [eventId, user.organizationId]);

  const newApplications = useMemo(() => participants.filter(p => p.status === 'new'), [participants]);
  const confirmedParticipants = useMemo(() => participants.filter(p => p.status === 'confirmed'), [participants]);
  const rejectedParticipants = useMemo(() => participants.filter(p => p.status === 'rejected'), [participants]);

  const handleStatusChange = (id: number, newStatus: 'confirmed' | 'rejected') => {
    setParticipants(prev => prev.map(p => p.id === id ? {...p, status: newStatus} : p));
  };

  const currentList = useMemo(() => {
    switch (activeTab) {
      case 'new':
        return newApplications;
      case 'confirmed':
        return confirmedParticipants;
      case 'rejected':
        return rejectedParticipants;
    }
  }, [activeTab, newApplications, confirmedParticipants, rejectedParticipants]);

  const renderEmptyState = () => {
    const emptyStates = {
      new: {title: "Новых заявок пока нет", subtitle: "Как только кто-то откликнется, вы увидите заявку здесь."},
      confirmed: {
        title: "Вы еще не подтвердили ни одного участника",
        subtitle: "Подтвержденные волонтеры появятся в этом списке."
      },
      rejected: {title: "Нет отклоненных заявок", subtitle: "Здесь будут заявки, которые вы отклонили."},
    };
    const {title, subtitle} = emptyStates[activeTab];

    return <EmptyState Icon={Users} title={title} subtitle={subtitle}/>;
  };

  const isTotallyEmpty = !loading && participants.length === 0;

  const renderHeader = () => (
    <header
      className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
      <button onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 -ml-2"
              aria-label="Назад">
        <ArrowLeft className="w-6 h-6 text-gray-700"/>
      </button>
      <h1 className="text-lg font-bold text-[#0C0D0E] text-center truncate px-2">
        {event ? `Участники: ${event.title}` : 'Участники'}
      </h1>
      <div className="w-8"></div>
    </header>
  );

  if (loading) {
    return (
      <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
        {renderHeader()}
        <main className="flex-grow overflow-y-auto bg-white">
          <div className="divide-y divide-gray-100">
            <ParticipantCellSkeleton/>
            <ParticipantCellSkeleton/>
            <ParticipantCellSkeleton/>
          </div>
        </main>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
        {renderHeader()}
        <main className="flex-grow flex items-center justify-center">
          <EmptyState Icon={Users} title="Событие не найдено" subtitle="Не удалось загрузить информацию о событии."/>
        </main>
      </div>
    )
  }

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      {renderHeader()}

      <section className="flex-shrink-0 p-4 bg-white">
        <div className="bg-gray-100 rounded-xl p-3 text-center grid grid-cols-3 gap-2">
          <div>
            <p className="font-bold text-lg text-[#0C0D0E]">{confirmedParticipants.length}/{event.capacity}</p>
            <p className="text-xs text-gray-500">Подтверждено</p>
          </div>
          <div>
            <p className="font-bold text-lg text-[#0C0D0E]">{newApplications.length}</p>
            <p className="text-xs text-gray-500">Новых заявок</p>
          </div>
          <div>
            <p className="font-bold text-lg text-[#0C0D0E]">{rejectedParticipants.length}</p>
            <p className="text-xs text-gray-500">Отклонено</p>
          </div>
        </div>
      </section>

      <nav className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button onClick={() => setActiveTab('new')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'new' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>Новые
            ({newApplications.length})
          </button>
          <button onClick={() => setActiveTab('confirmed')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'confirmed' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>Подтвержденные
            ({confirmedParticipants.length})
          </button>
          <button onClick={() => setActiveTab('rejected')}
                  className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'rejected' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}>Отклоненные
            ({rejectedParticipants.length})
          </button>
        </div>
      </nav>

      <main className="flex-grow overflow-y-auto bg-white">
        {isTotallyEmpty ? (
          <div className="pt-10">
            <EmptyState
              Icon={Users}
              title="Пока никто не записался"
              subtitle="Поделитесь событием, чтобы привлечь больше волонтеров!"
              action={{
                text: 'Поделиться событием',
                onClick: () => console.log('Share event'),
                type: 'secondary'
              }}
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {currentList.length > 0 ? (
              currentList.map(p => (
                <ParticipantCell
                  key={p.id}
                  participant={p}
                  tab={activeTab}
                  onAccept={(id) => handleStatusChange(id, 'confirmed')}
                  onReject={(id) => handleStatusChange(id, 'rejected')}
                />
              ))
            ) : (
              <div className="pt-10">{renderEmptyState()}</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EventParticipantsPage;
