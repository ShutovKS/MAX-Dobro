import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {fetchActivityHistoryEvents} from '../../../lib/api';
import type {HistoryEvent} from '../../../lib/types';
import {ArrowLeft, CheckCircle, Download, List, UserCircle} from 'lucide-react';
import {EmptyCalendarIllustrationIcon} from '../../../components/ui/icons';
import Toast from '../../../components/ui/Toast';
import ReviewModal from '../../../features/reviews/components/ReviewModal';
import EmptyState from '../../../components/ui/EmptyState';
import CancelModal from '../../../components/ui/CancelModal';
import {MESSAGES} from '../../../lib/constants';

const UpcomingEventCard: React.FC<{
  event: HistoryEvent;
  onCancelClick: () => void;
  onSelect: (id: number) => void;
}> = ({event, onCancelClick, onSelect}) => (
  <div className="bg-white rounded-2xl shadow-md p-4 w-full">
    <div className="flex items-start space-x-4">
      <div className="w-16 h-16 flex-shrink-0 bg-blue-100 rounded-xl flex items-center justify-center">
        <event.Icon className="w-10 h-10 text-[#007AFF]"/>
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-bold text-md text-[#0C0D0E]">{event.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{event.date}</p>
        <p className="text-sm text-gray-500">{event.location}</p>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-2">
      <button
        onClick={onCancelClick}
        className="flex-1 text-sm font-semibold py-2 px-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
        Отменить запись
      </button>
      <button onClick={() => onSelect(event.id)}
              className="flex-1 text-sm font-semibold py-2 px-3 rounded-lg bg-[#007AFF] text-white hover:bg-blue-600 transition-colors">
        Подробнее
      </button>
    </div>
  </div>
);

const PastEventCard: React.FC<{
  event: HistoryEvent;
  onReviewClick: () => void;
  onSelect: (id: number) => void;
  onStoryClick: () => void;
}> = ({event, onReviewClick, onSelect, onStoryClick}) => (
  <div className="bg-white rounded-2xl shadow-sm p-4 w-full opacity-90 event-card-print">
    <button onClick={() => onSelect(event.id)} className="flex items-start space-x-4 w-full text-left">
      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center">
        <event.Icon className="w-10 h-10 text-gray-400"/>
        <div className="absolute -top-1 -right-1 bg-[#1ABE43] text-white rounded-full print:hidden">
          <CheckCircle className="w-5 h-5"/>
        </div>
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-bold text-md text-gray-700">{event.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{event.date}</p>
        {event.role && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
            <UserCircle className="w-4 h-4"/>
            <span>Роль: {event.role}</span>
          </div>
        )}
        <div className="flex space-x-4 mt-2">
          <span className="text-sm font-semibold text-[#1ABE43]">+{event.rewards?.hours} часа добра</span>
          <span className="text-sm font-semibold text-[#FF9315]">+{event.rewards?.karma} кармы</span>
        </div>
      </div>
    </button>
    <div className="mt-3 pt-3 border-t border-gray-100 print:hidden flex space-x-2">
      <button
        onClick={onReviewClick}
        className="flex-1 text-sm font-semibold py-2 px-3 rounded-lg bg-transparent border-2 border-[#007AFF] text-[#007AFF] hover:bg-blue-50 transition-colors">
        Оставить отзыв
      </button>
      <button
        onClick={onStoryClick}
        className="flex-1 text-sm font-semibold py-2 px-3 rounded-lg bg-[#007AFF] text-white hover:bg-blue-600 transition-colors">
        Рассказать историю
      </button>
    </div>
  </div>
);

const ActivityHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState<HistoryEvent[]>([]);

  const [upcomingEvents, setUpcomingEvents] = useState<HistoryEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<HistoryEvent[]>([]);

  const [cancellingEvent, setCancellingEvent] = useState<HistoryEvent | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    onUndo?: () => void;
    type?: 'success' | 'info'
  }>({show: false, message: ''});
  const [lastCancelledEvent, setLastCancelledEvent] = useState<HistoryEvent | null>(null);
  const [reviewingEvent, setReviewingEvent] = useState<HistoryEvent | null>(null);

  const onBack = () => navigate('/app/profile');
  const onFindEvent = () => navigate('/app/home');
  const onSelectEvent = (id: number) => navigate(`/app/events/${id}`);
  const onStartCreateStory = (event: HistoryEvent) => navigate(`/app/stories/create?eventId=${event.id}`);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      const events = await fetchActivityHistoryEvents();
      setAllEvents(events);
      setUpcomingEvents(events.filter(e => e.status === 'upcoming'));
      setPastEvents(events.filter(e => e.status === 'past'));
      setLoading(false);
    };
    loadHistory();
  }, []);

  const handleConfirmCancel = () => {
    if (!cancellingEvent) return;

    setLastCancelledEvent(cancellingEvent);
    setUpcomingEvents(prev => prev.filter(e => e.id !== cancellingEvent.id));
    setCancellingEvent(null);

    setToast({
      show: true,
      message: MESSAGES.TOASTS.SIGNUP_CANCELLED,
      onUndo: handleUndoCancel,
      type: 'info'
    });
  };

  const handleUndoCancel = () => {
    if (lastCancelledEvent) {
      setUpcomingEvents(prev => [...prev, lastCancelledEvent]);
      setLastCancelledEvent(null);
    }
  };

  const handleReviewSubmit = () => {
    setReviewingEvent(null);
    setToast({
      show: true,
      message: MESSAGES.TOASTS.REVIEW_THANKS,
      type: "success",
    });
  };

  return (
    <>
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({...toast, show: false})}
        onUndo={toast.onUndo}
        type={toast.type || 'info'}
      />
      <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col" id="activity-history-screen">
        <header
          className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex justify-between items-center print:hidden">
          <button onClick={onBack}
                  className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700"/>
          </button>
          <h1 className="text-2xl font-bold text-[#0C0D0E]">История активностей</h1>
          <button onClick={() => window.print()}
                  className="flex items-center space-x-1.5 text-sm font-semibold text-[#007AFF]">
            <Download className="w-5 h-5"/>
            <span>Выгрузить в PDF</span>
          </button>
        </header>

        <div id="print-header" className="hidden print:block text-center p-4 border-b">
          <h1 className="text-2xl font-bold">История активностей</h1>
          <p className="text-lg">Отчет сформирован {new Date().toLocaleDateString('ru-RU')}</p>
        </div>

        <nav className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm print:hidden">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'upcoming' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}
            >
              Предстоящие
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'past' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}
            >
              Прошедшие
            </button>
          </div>
        </nav>

        <main className="flex-grow overflow-y-auto p-4 space-y-4">
          <div className="print:hidden">
            {loading ? (
              <p className="text-center text-gray-500">Загрузка...</p>
            ) : activeTab === 'upcoming' ? (
              upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => <UpcomingEventCard key={event.id} event={event}
                                                               onCancelClick={() => setCancellingEvent(event)}
                                                               onSelect={onSelectEvent}/>)
              ) : (
                <EmptyState
                  Icon={EmptyCalendarIllustrationIcon}
                  title="Время для новых дел!"
                  subtitle="Ваш список пока пуст. Самое время найти первое доброе дело и запланировать его!"
                  action={{
                    text: 'Найти событие',
                    onClick: onFindEvent,
                    type: 'primary',
                  }}
                />
              )
            ) : (
              pastEvents.length > 0 ? (
                pastEvents.map(event => <PastEventCard key={event.id} event={event}
                                                       onReviewClick={() => setReviewingEvent(event)}
                                                       onSelect={onSelectEvent}
                                                       onStoryClick={() => onStartCreateStory(event)}/>)
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                  <List className="w-24 h-24 text-gray-300 mb-4"/>
                  <h3 className="font-bold text-xl text-[#0C0D0E]">История пока пуста</h3>
                  <p className="text-gray-500 max-w-xs mt-1">Ваши завершенные дела появятся здесь после первого
                    участия.</p>
                </div>
              )
            )}
          </div>
          <div className="hidden print:block space-y-4">
            <h2 className="text-xl font-bold">Прошедшие события</h2>
            {pastEvents.length > 0 ? (
              pastEvents.map(event => <PastEventCard key={event.id} event={event} onReviewClick={() => {
              }} onSelect={() => {
              }} onStoryClick={() => {
              }}/>)
            ) : (
              <p>Нет прошедших событий для отображения.</p>
            )}
          </div>
        </main>
      </div>
      <CancelModal
        isOpen={!!cancellingEvent}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancellingEvent(null)}
      />
      <ReviewModal
        isOpen={!!reviewingEvent}
        event={reviewingEvent}
        onClose={() => setReviewingEvent(null)}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
};

export default ActivityHistoryPage;