// FILE: frontend/src/app/page.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Compose routes, session restore, onboarding, and tab navigation for the mini-app.
//   SCOPE: Session restore, Telegram/MAX auto-login, startapp deep-links, guest and authenticated route tables, toast shell
//   DEPENDS: M-FRONTEND-API, M-FRONTEND-AUTH, M-FRONTEND-TELEGRAM, M-FRONTEND-MAX, M-FRONTEND-SCREENS, M-FRONTEND-UI, M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-APP, V-M-FRONTEND-APP
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   App - route shell and session gate for the mini-app
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.1.0 - Added MAX auto-login alongside Telegram in session restore]
// END_CHANGE_SUMMARY

import React, { useEffect, useRef, useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useRoutes,
  useSearchParams,
} from 'react-router';
import SplashPage from './splash/page';
import AuthPage from './auth/page';
import OnboardingPage from './onboarding/page';
import TabsLayout from './tabs/layout';
import HomePage from './tabs/page';
import CoursesPage from './tabs/courses/page';
import OrganizationsPage from './tabs/organizations/page';
import StoriesPage from './tabs/stories/page';
import ProfilePage from './tabs/profile/page';
import { EventDetailPage } from './events/detail/page';
import CourseDetailPage from './courses/detail/page';
import OrganizationProfilePage from './organization/detail/page';
import LessonPage from './courses/lesson/page';
import CertificatePage from './courses/certificate/page';
import ActivityHistoryPage from './profile/history/page';
import AllAchievementsPage from './profile/achievements/page';
import CalendarPage from './profile/calendar/page';
import LeaderboardPage from './profile/leaderboard/page';
import SettingsPage from './profile/settings/page';
import EditProfilePage from './profile/edit/page';
import MyCertificatesPage from './profile/myCertificates/page';
import MyChatsPage from './profile/myChats/page';
import ErrorPage from './error/page';
import StoryDetailPage from './tabs/stories/detail/page';
import CreateStoryPage from './stories/create/page';
import AssistantChatPage from './chat/page';
import EventChatPage from './events/chat/page';
import Toast from '../components/ui/Toast';
import RewardsStorePage from './profile/rewards/page';
import RewardsDetailPage from './profile/rewards/detail/page';
import OrganizationDashboardPage from './organization/dashboard/page';
import EventManagementPage from './organization/events/page';
import CreateEventPage from './organization/events/create/page';
import EventParticipantsPage from './organization/events/participants/page';
import OrganizationSettingsPage from './organization/settings/page';
import type { Course, OrganizationEvent, RewardItem, User } from '../lib/types';
import { createEvent, fetchAllCourses, fetchRewards, purchaseReward, updateEvent, updateProfile } from '../lib/api';
import {
  getCurrentSession,
  isOnboardingComplete,
  logout,
  setOnboardingComplete,
} from '../lib/auth';
import { MESSAGES, ROUTES } from '../lib/constants';
import { initTelegram, isTelegramClient, telegramLogin, tgGetStartParam, waitForTelegramInitData } from '../lib/telegram-sdk';
import { initMax, isMaxClient, maxLogin, waitForMaxInitData } from '../lib/max-sdk';

// START_BLOCK_PARSE_START_PARAM
// Telegram deep-link `?startapp=kind_id` -> маршрут сущности (или null).
const routeFromStartParam = (): string | null => {
  const param = tgGetStartParam();
  if (!param) return null;
  const sep = param.indexOf('_');
  if (sep < 0) return null;
  const kind = param.slice(0, sep);
  const id = parseInt(param.slice(sep + 1), 10);
  if (!Number.isFinite(id)) return null;
  const map: Record<string, string> = {
    event: ROUTES.EVENT_DETAIL(id),
    course: ROUTES.COURSE_DETAIL(id),
    org: ROUTES.ORGANIZATION_DETAIL(id),
    story: ROUTES.STORY_DETAIL(id),
    reward: ROUTES.REWARD_DETAIL(id),
  };
  return map[kind] ?? null;
};
// END_BLOCK_PARSE_START_PARAM

// START_CONTRACT: App
//   PURPOSE: Restore session, apply Telegram deep links, and render the mini-app route table
//   INPUTS: { none - reads router location, session storage, and Telegram start param }
//   OUTPUTS: { ReactElement - splash, error, guest, or authenticated route tree }
//   SIDE_EFFECTS: Navigates, loads rewards/courses, writes onboarding flag, logout
//   LINKS: M-FRONTEND-APP, V-M-FRONTEND-APP, fn-getCurrentSession, fn-initTelegram
// END_CONTRACT: App
const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<'network' | 'server' | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [allRewards, setAllRewards] = useState<RewardItem[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type?: 'success' | 'info';
  }>({
    show: false,
    message: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!userData;
  const deepLinkConsumed = useRef(false);

  const getRedirectPath = (user: User) => {
    return user.role === 'organization'
      ? ROUTES.ORGANIZATION_DASHBOARD
      : ROUTES.HOME;
  };

  // START_BLOCK_RESTORE_SESSION
  const initializeApp = async () => {
    setError(null);
    initTelegram();
    initMax();
    let sessionFound = false;
    try {
      let session = await getCurrentSession();

      // Авто-логин через мессенджер: если активной сессии нет, но приложение
      // открыто из Telegram/MAX-клиента — дожидаемся initData и входим без формы.
      if (
        !session &&
        import.meta.env.VITE_API_MODE === 'real' &&
        (isTelegramClient() || isMaxClient())
      ) {
        await Promise.all([waitForTelegramInitData(), waitForMaxInitData()]);
        if ((await telegramLogin()) || (await maxLogin())) {
          session = await getCurrentSession();
        }
      }

      if (session) {
        sessionFound = true;
        setUserData(session.user);
        
        const [rewards, courses] = await Promise.all([
          fetchRewards(),
          fetchAllCourses(),
        ]);
        setAllRewards(rewards);
        setAllCourses(courses);

        const onboardingComplete = isOnboardingComplete();
        // Deep-link (?startapp=kind_id) имеет приоритет над редиректом на
        // главную — иначе navigate сюда перетирал переход на сущность.
        const deepRoute = deepLinkConsumed.current ? null : routeFromStartParam();
        if (!onboardingComplete) {
          navigate(ROUTES.ONBOARDING);
        } else if (deepRoute) {
          deepLinkConsumed.current = true;
          navigate(deepRoute);
        } else if (['', '/', '#/', ROUTES.AUTH].includes(location.pathname)) {
          navigate(getRedirectPath(session.user));
        }
      }
    } catch (err: any) {
      console.error('CRITICAL APP INITIALIZATION ERROR:', err);
      setError('network');
    } finally {
      setIsInitialized(true);
      // На экран входа уводим ТОЛЬКО если входить реально нечем (нет токена).
      // При наличии токена транзиентная ошибка покажет экран «повторить», а не вход.
      const hasToken = !!localStorage.getItem('internal_jwt');
      if (
        !sessionFound &&
        !hasToken &&
        ![ROUTES.AUTH, ROUTES.ONBOARDING].includes(location.pathname)
      ) {
        navigate(ROUTES.AUTH);
      }
    }
  };
  // END_BLOCK_RESTORE_SESSION

  useEffect(() => {
    initializeApp();
  }, []);

  // START_BLOCK_TELEGRAM_START_PARAM
  // Подстраховка для deep-link: срабатывает ПОСЛЕ полной инициализации
  // (isInitialized=true ставится в finally, уже после возможного navigate на
  // главную) — поэтому переход на сущность не перетирается.
  useEffect(() => {
    if (!isInitialized || !isAuthenticated || deepLinkConsumed.current) return;
    const route = routeFromStartParam();
    if (route) {
      deepLinkConsumed.current = true;
      navigate(route);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, isAuthenticated]);
  // END_BLOCK_TELEGRAM_START_PARAM

  // START_BLOCK_SESSION_HANDLERS
  const handleAuthSuccess = (session: { user: User; token: string }) => {
    setUserData(session.user);
    initializeApp(); // Переинициализируем приложение, чтобы загрузить все данные
  };

  const handleOnboardingComplete = () => {
    setOnboardingComplete();
    if (userData) {
      navigate(getRedirectPath(userData));
    } else {
      navigate(ROUTES.HOME);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserData(null);
    navigate(ROUTES.AUTH);
  };

  // Возврат из кабинета организатора в волонтёрский режим.
  // Вход в кабинет — чисто клиентская навигация (токен и личность не меняются),
  // поэтому сессия уже валидна: просто возвращаемся на главную БЕЗ сброса токена
  // и повторного логина. Иначе мелькало бы окно входа (а в браузере без initData
  // повторный автологин не пройдёт вовсе).
  const handleSwitchToVolunteer = () => {
    navigate(ROUTES.HOME);
  };

  const handleSaveProfile = async (updatedUser: User) => {
    try {
      await updateProfile({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        about: updatedUser.about,
        avatarUrl: updatedUser.avatarUrl,
      });
    } catch (e) {
      console.error('Failed to persist profile changes:', e);
    }
    setUserData(updatedUser);
    navigate(ROUTES.PROFILE_SETTINGS);
  };

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({ show: true, message, type });
  };
  
  const handleCourseCompletion = async (courseId: number) => {
    navigate(ROUTES.COURSE_CERTIFICATE(courseId));
    try {
      const updatedCourses = await fetchAllCourses();
      setAllCourses(updatedCourses);
    } catch (e) {
      console.error("Failed to re-fetch courses after completion:", e);
    }
  };
  // END_BLOCK_SESSION_HANDLERS

  // START_BLOCK_ROUTE_WRAPPERS
  const EventChatPageWrapper = () => {
    const { id } = useParams();
    return <EventChatPage eventId={parseInt(id || '0', 10)} user={userData!} onBack={() => navigate(-1)} />;
  };

  const CourseDetailPageWrapper = () => {
    const { id } = useParams();
    return <CourseDetailPage id={parseInt(id || '0', 10)} />;
  };

  const LessonPageWrapper = () => {
    const { id, subId } = useParams();
    const courseId = parseInt(id || '0', 10);
    const lessonId = parseInt(subId || '0', 10);
    return <LessonPage courseId={courseId} lessonId={lessonId}
                       onClose={() => navigate(ROUTES.COURSE_DETAIL(courseId))}
                       onComplete={handleCourseCompletion}/>;
  };

  const CertificatePageWrapper = () => {
    const { id } = useParams();
    const courseId = parseInt(id || '0', 10);
    return <CertificatePage courseId={courseId} allCourses={allCourses} user={userData!} onBack={() => navigate(ROUTES.COURSE_DETAIL(courseId))} />;
  };
  
  const OrganizationProfilePageWrapper = () => {
    const { id } = useParams();
    return <OrganizationProfilePage id={parseInt(id || '0', 10)} />;
  };

  const CreateStoryPageWrapper = () => {
    const [searchParams] = useSearchParams();
    return <CreateStoryPage onCancel={() => navigate(ROUTES.STORIES)} onPublish={() => {
      showToast(MESSAGES.TOASTS.STORY_PUBLISHED, 'success');
      navigate(ROUTES.STORIES);
    }} initialEventId={searchParams.get('eventId')} />;
  };

  const StoryDetailPageWrapper = () => {
    const { id } = useParams();
    return <StoryDetailPage id={parseInt(id || '0', 10)} currentUserAvatar={userData!.avatarUrl} />;
  };

  const RewardsDetailPageWrapper = () => {
    const { id } = useParams();
    const rewardId = parseInt(id || '0', 10);
    return <RewardsDetailPage rewardId={rewardId} allRewards={allRewards} user={userData!} onPurchase={async (rId) => {
      await purchaseReward(rId);
      setAllRewards(prev => prev.map(r => r.id === rId ? { ...r, isPurchased: true } : r));
      // Бэкенд списал карму — обновляем профиль, иначе баланс/карма устаревают до перезагрузки.
      try {
        const refreshed = await getCurrentSession();
        if (refreshed) setUserData(refreshed.user);
      } catch (e) {
        console.error('Failed to refresh profile after purchase:', e);
      }
      showToast(MESSAGES.TOASTS.REWARD_PURCHASED, 'success');
      navigate(ROUTES.PROFILE_REWARDS);
    }} />;
  };

  const LeaderboardPageWrapper = () => <LeaderboardPage user={userData!} onBack={() => navigate(ROUTES.PROFILE)} />;
  const SettingsPageWrapper = () => <SettingsPage onBack={() => navigate(ROUTES.PROFILE)} onLogout={handleLogout} />;
  const EditProfilePageWrapper = () => <EditProfilePage user={userData!} onCancel={() => navigate(ROUTES.PROFILE_SETTINGS)} onSave={handleSaveProfile} />;
  const MyCertificatesPageWrapper = () => <MyCertificatesPage user={userData!} onBack={() => navigate(ROUTES.PROFILE)} onSelectCertificate={(courseId) => navigate(ROUTES.COURSE_CERTIFICATE(courseId))} onGoToTraining={() => navigate(ROUTES.TRAINING)} />;
  const RewardsStorePageWrapper = () => <RewardsStorePage user={userData!} rewards={allRewards} onBack={() => navigate(ROUTES.PROFILE)} />;

  const EventManagementPageWrapper = () => <EventManagementPage user={userData!} onBack={() => navigate(ROUTES.ORGANIZATION_DASHBOARD)} onCreateEvent={() => navigate(ROUTES.ORGANIZATION_EVENTS_CREATE)} onEditEvent={(e) => navigate(ROUTES.ORGANIZATION_EVENTS_EDIT(e.id))} onManageParticipants={(e) => navigate(ROUTES.ORGANIZATION_EVENTS_PARTICIPANTS(e.id))} />;
  const CreateEventPageWrapper = () => <CreateEventPage user={userData!} onBack={() => navigate(ROUTES.ORGANIZATION_EVENTS)} onPublish={async (data) => {
    try {
      await createEvent(data);
      showToast(MESSAGES.TOASTS.EVENT_PUBLISHED, 'success');
      navigate(ROUTES.ORGANIZATION_EVENTS);
    } catch (e) {
      console.error('Failed to create event:', e);
      showToast('Не удалось опубликовать событие', 'info');
    }
  }} />;
  const EditEventPageWrapper = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const id = parseInt(eventId!, 10);
    return <CreateEventPage user={userData!} event={{ id } as OrganizationEvent} onBack={() => navigate(ROUTES.ORGANIZATION_EVENTS)} onPublish={async (data) => {
      try {
        await updateEvent(id, data);
        showToast(MESSAGES.TOASTS.EVENT_SAVED, 'success');
        navigate(ROUTES.ORGANIZATION_EVENTS);
      } catch (e) {
        console.error('Failed to update event:', e);
        showToast('Не удалось сохранить событие', 'info');
      }
    }} />;
  };
  const EventParticipantsPageWrapper = () => <EventParticipantsPage user={userData!} onBack={() => navigate(ROUTES.ORGANIZATION_EVENTS)} />;
  const OrganizationSettingsPageWrapper = () => <OrganizationSettingsPage onBack={() => navigate(ROUTES.ORGANIZATION_DASHBOARD)} onLogout={handleLogout} />;
  // END_BLOCK_ROUTE_WRAPPERS

  // START_BLOCK_ROUTE_TABLE
  const element = useRoutes(
    isAuthenticated && userData ?
      [
        {
          path: "/app",
          element: <TabsLayout user={userData} onSwitchToOrganizationMode={() => navigate(ROUTES.ORGANIZATION_DASHBOARD)} />,
          children: [
            { index: true, element: <Navigate to={ROUTES.HOME} replace /> },
            { path: "home", element: <HomePage /> },
            { path: "training", element: <CoursesPage /> },
            { path: "organizations", element: <OrganizationsPage /> },
            { path: "stories", element: <StoriesPage /> },
            { path: "profile", element: <ProfilePage /> },
          ],
        },
        { path: "/app/events/:id/chat", element: <EventChatPageWrapper /> },
        { path: "/app/events/:id", element: <EventDetailPage /> },
        { path: "/app/courses/:id/lesson/:subId", element: <LessonPageWrapper /> },
        { path: "/app/courses/:id/certificate", element: <CertificatePageWrapper /> },
        { path: "/app/courses/:id", element: <CourseDetailPageWrapper /> },
        { path: "/app/organizations/:id", element: <OrganizationProfilePageWrapper /> },
        { path: "/app/stories/create", element: <CreateStoryPageWrapper /> },
        { path: "/app/stories/:id", element: <StoryDetailPageWrapper /> },
        { path: "/app/rewards/:id", element: <RewardsDetailPageWrapper /> },
        { path: "/app/chat", element: <AssistantChatPage onClose={() => navigate(-1)} user={userData} /> },
        { path: ROUTES.PROFILE_ACTIVITY_HISTORY, element: <ActivityHistoryPage /> },
        { path: ROUTES.PROFILE_ACHIEVEMENTS, element: <AllAchievementsPage /> },
        { path: ROUTES.PROFILE_CALENDAR, element: <CalendarPage /> },
        { path: ROUTES.PROFILE_LEADERBOARDS, element: <LeaderboardPageWrapper /> },
        { path: ROUTES.PROFILE_SETTINGS, element: <SettingsPageWrapper /> },
        { path: ROUTES.PROFILE_EDIT, element: <EditProfilePageWrapper /> },
        { path: ROUTES.PROFILE_CERTIFICATES, element: <MyCertificatesPageWrapper /> },
        { path: ROUTES.PROFILE_CHATS, element: <MyChatsPage /> },
        { path: ROUTES.PROFILE_REWARDS, element: <RewardsStorePageWrapper /> },
        { path: ROUTES.ORGANIZATION_DASHBOARD, element: <OrganizationDashboardPage user={userData} onSwitchToVolunteer={handleSwitchToVolunteer} onManageEvents={() => navigate(ROUTES.ORGANIZATION_EVENTS)} onCreateEvent={() => navigate(ROUTES.ORGANIZATION_EVENTS_CREATE)} onNavigateToSettings={() => navigate(ROUTES.ORGANIZATION_SETTINGS)} /> },
        { path: ROUTES.ORGANIZATION_EVENTS, element: <EventManagementPageWrapper /> },
        { path: ROUTES.ORGANIZATION_EVENTS_CREATE, element: <CreateEventPageWrapper /> },
        { path: ROUTES.ORGANIZATION_EVENTS_EDIT(':eventId'), element: <EditEventPageWrapper /> },
        { path: ROUTES.ORGANIZATION_EVENTS_PARTICIPANTS(':eventId'), element: <EventParticipantsPageWrapper /> },
        { path: ROUTES.ORGANIZATION_SETTINGS, element: <OrganizationSettingsPageWrapper /> },
        { path: "/", element: <Navigate to={getRedirectPath(userData)} replace /> },
        { path: "/organization", element: <Navigate to={ROUTES.ORGANIZATION_DASHBOARD} replace /> },
        { path: "*", element: <Navigate to={getRedirectPath(userData)} replace /> },
      ] :
      [
        { path: ROUTES.AUTH, element: <AuthPage onAuthSuccess={handleAuthSuccess} /> },
        { path: ROUTES.ONBOARDING, element: <OnboardingPage onComplete={handleOnboardingComplete} /> },
        { path: "*", element: <Navigate to={ROUTES.AUTH} replace /> },
      ]
  );
  // END_BLOCK_ROUTE_TABLE

  // START_BLOCK_RENDER_GATE
  if (!isInitialized) {
    return <SplashPage />;
  }

  // Ошибку показываем РАНЬШЕ сплэш-гварда по курсам — иначе при сбое загрузки
  // курсов экран навсегда застревает на сплэше без возможности повторить.
  if (error) {
    return <ErrorPage type={error} onRetry={initializeApp} />;
  }

  // Сплэш держим, пока нет userData. Пустой список курсов — валидное состояние
  // (не зацикливаемся на сплэше, если курсов просто нет).
  if (isAuthenticated && !userData) {
    return <SplashPage />;
  }

  return (
    <>
      {element}
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        type={toast.type || 'info'}
      />
    </>
  );
  // END_BLOCK_RENDER_GATE
};

export default App;
