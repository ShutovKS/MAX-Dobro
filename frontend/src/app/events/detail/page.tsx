import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router';
import type {Achievement, AppEvent, Friend, MapMarker, Organization, ProfileSubScreen} from '../../../lib/types';
import {
  cancelEventParticipation,
  fetchAllAchievements,
  fetchEventById,
  fetchFriends,
  fetchMapMarkers,
  fetchOrganizationById,
  participateInEvent,
} from '../../../lib/api';
import {ArrowLeft, Calendar, Check, Clock, List, MapPin, MessageSquare, Share2, Star, Trophy} from 'lucide-react';
import Toast from '../../../components/ui/Toast';
import NewAchievementModal from '../../../components/ui/NewAchievementModal';
import CancelModal from '../../../components/ui/CancelModal';
import InteractiveMap from '../../../components/ui/InteractiveMap';
import {FIRST_STEP_ACHIEVEMENT_ID, MESSAGES, MODAL_TRANSITION_DURATION} from '../../../lib/constants';
import {iconMap} from '../../../lib/iconMap';
import {buildDeepLink, tgHaptic, tgShareUrl} from '../../../lib/telegram-sdk';
import {telegramUiActive, useTelegramBackButton, useTelegramMainButton} from '../../../lib/useTelegramUI';

const ConfirmationModal: React.FC<{
  isOpen: boolean;
  event: AppEvent;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({isOpen, event, onConfirm, onCancel}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}
      onClick={onCancel}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl p-6 pt-4 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <h2 id="confirm-title" className="text-xl font-bold text-[#0C0D0E] text-center mb-6">Подтвердите участие</h2>
        <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center space-x-4">
            <List className="w-6 h-6 text-gray-500 flex-shrink-0"/>
            <span className="font-semibold text-[#0C0D0E]">{event.title}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-gray-500 flex-shrink-0"/>
            <span className="text-[rgb(12,13,14,0.52)]">{event.date}</span>
          </div>
          <div className="flex items-center space-x-4">
            <MapPin className="w-6 h-6 text-gray-500 flex-shrink-0"/>
            <span className="text-[rgb(12,13,14,0.52)]">{event.location}</span>
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 text-center mb-6">
          Организатор рассчитывает на вашу помощь. Если планы изменятся, пожалуйста, отмените запись в своем профиле.
        </div>
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full bg-[#007AFF] text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-600 transition-colors"
          >
            Подтвердить
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-transparent text-[#007AFF] font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessModal: React.FC<{
  event: AppEvent;
  onClose: () => void;
  isOpen: boolean;
  onInvite: () => void;
}> = ({event, onClose, isOpen, onInvite}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" role="dialog"
         aria-modal="true">
      <div
        className="bg-white rounded-2xl shadow-xl p-8 m-4 w-full max-w-sm text-center flex flex-col items-center space-y-4 animate-scale-in">
        <div className="w-24 h-24">
          <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
            <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14 27l5.917 4.917L37.75 22"/>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-[#1ABE43]">Вы в деле!</h2>
        <p className="text-[rgb(12,13,14,0.52)]">
          Мы добавили событие в ваш календарь. Спасибо, что делаете мир лучше!
        </p>
        <div className="w-full bg-gray-50 rounded-xl p-4 mt-2 text-center border border-gray-200">
          <p className="font-semibold text-gray-700">Позовите друзей — вместе веселее!</p>
          <button
            onClick={onInvite}
            className="mt-3 text-sm font-semibold bg-transparent border-2 border-[#007AFF] text-[#007AFF] py-2 px-5 rounded-xl hover:bg-blue-50 transition-colors">
            Пригласить друга
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-[#007AFF] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-opacity mt-2"
        >
          Отлично!
        </button>
      </div>
      <style>{`
                .checkmark-circle-bg { stroke-width: 3; stroke-miterlimit: 10; stroke: #1ABE43; fill: none; opacity: 0.1; }
                .checkmark-circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 3; stroke-miterlimit: 10; stroke: #1ABE43; fill: none; animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
                .checkmark-check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 4; stroke-linecap: round; stroke: #1ABE43; animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards; }
                @keyframes stroke { 100% { stroke-dashoffset: 0; } }
            `}</style>
    </div>
  );
};

const EventDetailSkeleton: React.FC = () => (
  <div className="w-full h-screen bg-white overflow-hidden animate-pulse">
    <div className="h-[40vh] w-full bg-gray-200" />
    <div className="relative bg-white rounded-t-2xl -mt-6 p-6 space-y-5">
      <div className="h-6 w-24 bg-gray-200 rounded-full" />
      <div className="space-y-2">
        <div className="h-7 w-3/4 bg-gray-200 rounded" />
        <div className="h-7 w-1/2 bg-gray-200 rounded" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-4 w-1/2 bg-gray-100 rounded" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
      </div>
      <div className="h-14 w-full bg-gray-100 rounded-2xl" />
      <div className="h-16 w-full bg-gray-100 rounded-2xl" />
      <div className="h-24 w-full bg-gray-100 rounded-2xl" />
    </div>
  </div>
);

export const EventDetailPage: React.FC = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<AppEvent | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [eventMarker, setEventMarker] = useState<MapMarker | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; onUndo?: () => void }>({
    show: false,
    message: ''
  });
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        setLoading(true);
        const eventId = parseInt(id, 10);
        const [eventData, achievementsData, friendsData, markersData] = await Promise.all([
          fetchEventById(eventId),
          fetchAllAchievements(),
          fetchFriends(),
          fetchMapMarkers()
        ]);

        if (eventData) {
          const typedEventData = eventData as AppEvent;
          setEvent(typedEventData);
          // Участие берём с сервера — не сбрасывается при возврате из чата.
          setIsSignedUp(!!typedEventData.isParticipating);
          const orgData = await fetchOrganizationById(typedEventData.organizationId);
          if (orgData) setOrganization(orgData);

          const marker = (markersData as MapMarker[]).find(m => m.id === typedEventData.id);
          setEventMarker(marker || null);
        }
        setAllAchievements(achievementsData);
        setFriends(friendsData);
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const onBack = () => navigate(-1);
  const onNavigateProfile = (screen: ProfileSubScreen) => navigate(`/app/profile/${screen}`);
  const onSelectOrganization = (orgId: number) => navigate(`/app/organizations/${orgId}`);
  const onOpenChat = (evt: AppEvent) => navigate(`/app/events/${evt.id}/chat`);

  const handleSignUpClick = () => setShowConfirmation(true);
  const handleConfirmSignUp = async () => {
    if (!event) return;

    setShowConfirmation(false);

    try {
      await participateInEvent(event.id);
      setIsSignedUp(true);
      tgHaptic.notification('success');
      setTimeout(() => setShowSuccess(true), MODAL_TRANSITION_DURATION);
    } catch (error) {
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Не удалось записаться на событие.',
      });
    }
  };
  const handleCancelSignUp = () => setShowConfirmation(false);
  const handleCloseSuccessModal = () => {
    setShowSuccess(false);
    const firstAchievement = allAchievements.find(a => a.id === FIRST_STEP_ACHIEVEMENT_ID);
    if (firstAchievement) setTimeout(() => setUnlockedAchievement(firstAchievement), MODAL_TRANSITION_DURATION);
  };
  const handleNavigateToAchievements = () => {
    setUnlockedAchievement(null);
    onNavigateProfile('allAchievements');
  }
  const handleOpenCancelModal = () => setShowCancelConfirm(true);
  const handleConfirmCancel = async () => {
    if (!event) return;

    setShowCancelConfirm(false);

    try {
      await cancelEventParticipation(event.id);
      setIsSignedUp(false);
      setToast({show: true, message: MESSAGES.TOASTS.SIGNUP_CANCELLED});
    } catch (error) {
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Не удалось отменить участие.',
      });
    }
  };
  const handleCloseCancelModal = () => setShowCancelConfirm(false);
  const shareEvent = () => {
    if (!event) return;
    tgShareUrl(
      buildDeepLink('event', event.id),
      `Присоединяйся к «${event.title}» в Добро Club!`,
    );
  };
  const handleInvite = () => {
    setShowSuccess(false);
    // Нативное приглашение Telegram: открывается выбор чата для отправки ссылки
    // на событие (вместо старого MAX-окна с поиском друзей по имени).
    shareEvent();
    setToast({show: true, message: MESSAGES.TOASTS.INVITES_SENT});
  };

  const mainButtonAction = isSignedUp ? handleOpenCancelModal : handleSignUpClick;

  // Нативные кнопки Telegram (до ранних return — порядок хуков).
  useTelegramBackButton(onBack);
  useTelegramMainButton({
    text: isSignedUp ? 'Вы участвуете' : 'Я помогу!',
    onClick: mainButtonAction,
    visible:
      telegramUiActive() &&
      !loading &&
      !!event &&
      !showConfirmation &&
      !showSuccess &&
      !showCancelConfirm &&
      !unlockedAchievement,
  });

  if (loading) {
    return <EventDetailSkeleton />;
  }

  if (!event) {
    return <div className="w-full h-screen flex items-center justify-center">Событие не найдено.</div>;
  }

  const friendsToShow = friends.slice(0, 3);
  const remainingFriendsCount = friends.length - friendsToShow.length;

  return (
    <>
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({...toast, show: false})}
             onUndo={toast.onUndo} type="success"/>
      <div className="relative w-full h-screen font-sans antialiased bg-white overflow-y-auto">
        <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
          <button onClick={onBack} className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
                  aria-label="Назад"><ArrowLeft className="w-6 h-6 text-white"/></button>
          <button onClick={shareEvent} className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
                  aria-label="Поделиться"><Share2 className="w-5 h-5 text-white"/></button>
        </header>
        <div
          className="h-[40vh] w-full bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] flex items-center justify-center">
          {(() => {
            const IconComponent = iconMap[event.icon] || Star;
            return <IconComponent className="w-32 h-32 text-white/60"/>;
          })()}
        </div>
        <div className="relative bg-white rounded-t-2xl -mt-6 p-6 space-y-6">
          <section>
            <div className="flex space-x-2 mb-2"><span
              className="text-xs font-semibold bg-blue-100 text-[#007AFF] px-3 py-1 rounded-full">{event.category}</span>
            </div>
            <h1 className="text-[28px] font-bold text-[#0C0D0E]">{event.title}</h1>
            <div className="mt-4 space-y-2 text-[rgb(12,13,14,0.52)]">
              <div className="flex items-center space-x-3"><Calendar
                className="w-5 h-5 text-gray-400"/><span>{event.date}</span></div>
              <div className="flex items-center space-x-3"><MapPin
                className="w-5 h-5 text-gray-400"/><span>{event.location}</span></div>
            </div>
          </section>
          <section>
            {isSignedUp ? (
              <button onClick={() => onOpenChat(event)}
                      className="w-full flex items-center justify-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors relative">
                <MessageSquare className="w-6 h-6 text-[#007AFF]"/>
                <span className="font-semibold text-lg text-[#0C0D0E]">Чат мероприятия</span>
                <span
                  className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">3</span>
              </button>
            ) : (
              <div
                className="w-full flex items-center justify-center space-x-3 p-4 bg-gray-50 rounded-2xl relative text-center">
                <MessageSquare className="w-6 h-6 text-gray-400"/>
                <span className="font-semibold text-lg text-gray-400">Чат доступен после записи</span>
              </div>
            )}
          </section>
          <section>
            <button onClick={() => onSelectOrganization(event.organizationId)}
                    className="w-full flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors">
              <img src={organization?.logoUrl} alt="Логотип организатора" className="w-12 h-12 rounded-full"/>
              <div className="text-left">
                <h3 className="font-semibold text-[#0C0D0E]">Организатор "{event.organizationName}"</h3>
                {organization && (
                  <div className="flex items-center text-sm text-[rgb(12,13,14,0.52)]">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1"/>
                    <span>{organization.rating} ({organization.reviewCount} отзывов)</span>
                  </div>
                )}
              </div>
            </button>
          </section>
          {event.location !== 'Онлайн' && eventMarker && (
            <section>
              <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Место проведения</h2>
              <div className="h-64 w-full rounded-2xl overflow-hidden shadow-md relative z-0">
                <InteractiveMap
                  markers={[eventMarker]}
                  center={eventMarker.position}
                  zoom={15}
                  onMarkerClick={() => {
                  }}
                />
              </div>
            </section>
          )}
          <section>
            <h2 className="text-xl font-bold text-[#0C0D0E] mb-2">Что нужно делать?</h2>
            <p className="text-[rgb(12,13,14,0.52)] leading-relaxed">Присоединяйтесь к нам в эту субботу, чтобы сделать
              парк "Сокольники" чище и уютнее! Мы будем убирать мусор, сажать новые цветы и приводить в порядок дорожки.
              Отличное настроение и работа в дружной команде гарантированы.</p>
          </section>
          {event.requirements && event.requirements.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Требования к волонтерам</h2>
              <ul className="space-y-3">
                {event.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div
                      className="w-6 h-6 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-[#007AFF]" strokeWidth={3}/></div>
                    <span className="text-[rgb(12,13,14,0.52)] leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {event.rewards && (
            <section>
              <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Что вы получите?</h2>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3"><Star className="w-6 h-6 text-yellow-400 fill-current"/>
                  <span className="text-[rgb(12,13,14,0.52)]">+{event.rewards.karma} баллов кармы</span></li>
                <li className="flex items-center space-x-3"><Clock className="w-6 h-6 text-blue-400"/> <span
                  className="text-[rgb(12,13,14,0.52)]">+{event.rewards.hours} часа добра в вашу копилку</span></li>
                <li className="flex items-center space-x-3"><Trophy className="w-6 h-6 text-orange-400"/> <span
                  className="text-[rgb(12,13,14,0.52)]">Сертификат участника</span></li>
              </ul>
            </section>
          )}
          <section>
            <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Кто из друзей идет?</h2>
            {friends.length > 0 ? (
              <div className="flex -space-x-2">
                {friendsToShow.map(friend => (
                  <img key={friend.id} loading="lazy" className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                       src={friend.avatarUrl} alt={friend.name}/>
                ))}
                {remainingFriendsCount > 0 && (
                  <div
                    className="h-10 w-10 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-[rgb(12,13,14,0.52)]">+{remainingFriendsCount}</div>
                )}
              </div>
            ) : (
              <p className="text-[rgb(12,13,14,0.52)]">Вы будете первым из ваших друзей!</p>
            )}
          </section>
        </div>
        <div className="h-28"></div>
        {!telegramUiActive() && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-30">
            <button onClick={mainButtonAction}
                    className={`w-full py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg ${isSignedUp ? 'bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300' : 'bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] text-white font-bold hover:opacity-90'}`}>
              {isSignedUp ? (<><Check className="w-5 h-5 mr-2"/>Вы участвуете</>) : ('Я помогу!')}
            </button>
          </div>
        )}
      </div>
      <ConfirmationModal isOpen={showConfirmation} event={event} onConfirm={handleConfirmSignUp}
                         onCancel={handleCancelSignUp}/>
      <SuccessModal isOpen={showSuccess} event={event} onClose={handleCloseSuccessModal} onInvite={handleInvite}/>
      <CancelModal isOpen={showCancelConfirm} onConfirm={handleConfirmCancel} onCancel={handleCloseCancelModal}/>
      <NewAchievementModal achievement={unlockedAchievement} onClose={() => setUnlockedAchievement(null)}
                           onNavigateToAchievements={handleNavigateToAchievements}/>
    </>
  );
};
