import React, {useEffect, useState} from 'react';
import type {AppEvent, Organization} from '../../../lib/types';
import {fetchAllEvents, fetchOrganizationById, updateOrganizationSubscription} from '../../../lib/api';
import {ArrowLeft, BadgeCheck, Globe, SearchX, Share2, Star} from 'lucide-react';
import SubscribeModal from '../../../components/ui/SubscribeModal';
import Toast from '../../../components/ui/Toast';
import SkeletonCard from '../../../components/ui/SkeletonCard';
import EventCard from '../../../components/ui/EventCard';
import EmptyState from '../../../components/ui/EmptyState';

const OrganizationProfilePage: React.FC<{
  id: number;
}> = ({id}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'events'>('description');
  const [eventsLoading, setEventsLoading] = useState(true);
  const [organizationEvents, setOrganizationEvents] = useState<AppEvent[]>([]);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; onUndo?: () => void }>({
    show: false,
    message: ''
  });

  useEffect(() => {
    const loadOrg = async () => {
      setLoading(true);
      const data = await fetchOrganizationById(id);
      if (data) setOrganization(data);
      setLoading(false);
    };
    loadOrg();
  }, [id]);

  useEffect(() => {
    if (!organization) return;
    const loadOrgEvents = async () => {
      if (activeTab === 'events') {
        setEventsLoading(true);
        const allEvents = await fetchAllEvents();
        setOrganizationEvents(allEvents.filter(event => event.organizationId === organization.id));
        setEventsLoading(false);
      }
    };
    loadOrgEvents();
  }, [activeTab, organization]);

  const onBack = () => window.location.hash = '#/organizations';
  const onSelectEvent = (eventId: number) => window.location.hash = `#/events/${eventId}`;

  const onToggleSubscription = async () => {
    if (!organization) return;
    const newSubStatus = !organization.isSubscribed;
    await updateOrganizationSubscription(organization.id, newSubStatus);
    setOrganization(org => org ? ({...org, isSubscribed: newSubStatus}) : null);
  };

  const handleSubscriptionClick = () => {
    if (!organization) return;
    if (organization.isSubscribed) {
      onToggleSubscription();
      setToast({
        show: true,
        message: `Вы отписались от "${organization.name}"`,
        onUndo: onToggleSubscription,
      });
    } else {
      setShowSubscribeModal(true);
    }
  };

  const handleConfirmSubscription = async () => {
    if (!organization) return;
    await onToggleSubscription();
    setShowSubscribeModal(false);
    setToast({
      show: true,
      message: `Вы подписались на "${organization.name}"`,
      onUndo: onToggleSubscription,
    });
  };

  if (loading || !organization) {
    return <div className="w-full h-screen flex items-center justify-center">Загрузка организации...</div>;
  }

  return (
    <>
      <div className="relative w-full h-screen font-sans antialiased bg-white overflow-y-auto">
        <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
          <button onClick={onBack} className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
                  aria-label="Назад">
            <ArrowLeft className="w-6 h-6 text-white"/>
          </button>
          <button className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
                  aria-label="Поделиться">
            <Share2 className="w-5 h-5 text-white"/>
          </button>
        </header>

        <div className="relative">
          <div
            className="h-[25vh] w-full bg-gray-300 bg-cover bg-center"
            style={{backgroundImage: `url(${organization.coverImageUrl})`}}
          ></div>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <img
              src={organization.logoUrl}
              alt={`Логотип ${organization.name}`}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
          </div>
        </div>

        <section className="text-center pt-16 px-6 pb-4">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-[28px] font-bold text-[#0C0D0E]">{organization.name}</h1>
            {organization.isVerified && <BadgeCheck className="w-6 h-6 text-[#007AFF] fill-current"/>}
          </div>
          <p className="text-[rgb(12,13,14,0.52)] mt-1">{organization.description}</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-[rgb(12,13,14,0.52)] mt-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current"/>
            <span className="font-semibold text-[#0C0D0E]">{organization.rating}</span>
            <span>&middot;</span>
            <span>{Intl.NumberFormat('ru-RU').format(organization.subscribers)} подписчиков</span>
          </div>
        </section>

        <section className="px-6 flex space-x-3">
          <button
            onClick={handleSubscriptionClick}
            className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-colors ${
              organization.isSubscribed
                ? 'bg-gray-100 text-gray-600'
                : 'bg-[#007AFF] text-white shadow-md'
            }`}
          >
            {organization.isSubscribed ? 'Вы подписаны' : 'Подписаться'}
          </button>
          <a href={organization.websiteUrl} target="_blank" rel="noopener noreferrer"
             className="flex-1 flex items-center justify-center space-x-2 font-semibold py-3 px-4 rounded-xl border-2 border-gray-200 text-[#0C0D0E] hover:bg-gray-50 transition-colors">
            <Globe className="w-5 h-5"/>
            <span>Сайт</span>
          </a>
        </section>

        <section className="mt-6 border-b border-gray-200">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-3 font-semibold w-full transition-colors ${activeTab === 'description' ? 'text-[#007AFF] border-b-2 border-[#007AFF]' : 'text-gray-500'}`}
            >
              Описание
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-3 font-semibold w-full transition-colors ${activeTab === 'events' ? 'text-[#007AFF] border-b-2 border-[#007AFF]' : 'text-gray-500'}`}
            >
              События
            </button>
          </div>
        </section>

        <section className="p-6">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#0C0D0E]">О фонде</h2>
              <p
                className="text-[rgb(12,13,14,0.52)] leading-relaxed whitespace-pre-line">{organization.fullDescription}</p>
              <h2 className="text-xl font-bold text-[#0C0D0E] pt-4">Контакты</h2>
              <p className="text-[rgb(12,13,14,0.52)]">Москва, ул. Добрая, д. 1</p>
            </div>
          )}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {eventsLoading ? (
                <>
                  <SkeletonCard/>
                  <SkeletonCard/>
                  <SkeletonCard/>
                </>
              ) : organizationEvents.length > 0 ? (
                organizationEvents.map(event => (
                  <button key={event.id} onClick={() => onSelectEvent(event.id)}
                          className="w-full transition-transform duration-200 active:scale-95">
                    <EventCard event={event}/>
                  </button>
                ))
              ) : (
                <EmptyState
                  Icon={SearchX}
                  title="Пока здесь тихо"
                  subtitle="У этой организации сейчас нет активных мероприятий. Подпишитесь, чтобы узнать о новых первыми!"
                  action={!organization.isSubscribed ? {
                    text: 'Подписаться на организацию',
                    onClick: handleSubscriptionClick,
                    type: 'secondary',
                  } : undefined}
                />
              )}
            </div>
          )}
        </section>

        <div className="h-10"></div>
      </div>
      <SubscribeModal
        isOpen={showSubscribeModal}
        organizationName={organization.name}
        onConfirm={handleConfirmSubscription}
        onCancel={() => setShowSubscribeModal(false)}
      />
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({...toast, show: false})}
        onUndo={toast.onUndo}
        type="info"
      />
    </>
  );
};

export default OrganizationProfilePage;