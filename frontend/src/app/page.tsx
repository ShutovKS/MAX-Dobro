import React, { useEffect, useState } from 'react';
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
import { fetchAllCourses, fetchRewards, purchaseReward, updateProfile } from '../lib/api';
import {
  getCurrentSession,
  isOnboardingComplete,
  logout,
  setOnboardingComplete,
} from '../lib/auth';
import { MESSAGES, ROUTES } from '../lib/constants';
import { initTelegram, isTelegramEnv, telegramLogin } from '../lib/telegram-sdk';

const App: React.FC = () => {
  /** <context:frontend_app_shell> Route shell for auth, onboarding, and tab switching. </context:frontend_app_shell> */
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

  const getRedirectPath = (user: User) => {
    return user.role === 'organization'
      ? ROUTES.ORGANIZATION_DASHBOARD
      : ROUTES.HOME;
  };

  const initializeApp = async () => {
    setError(null);
    initTelegram();
    let sessionFound = false;
    try {
      let session = await getCurrentSession();

      // Авто-логин через Telegram: если активной сессии нет, но приложение
      // открыто внутри Telegram — входим по initData без формы.
      if (
        !session &&
        import.meta.env.VITE_API_MODE === 'real' &&
        isTelegramEnv()
      ) {
        const ok = await telegramLogin();
        if (ok) {
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
        if (!onboardingComplete) {
          navigate(ROUTES.ONBOARDING);
        } else if (['', '/', '#/', ROUTES.AUTH].includes(location.pathname)) {
          navigate(getRedirectPath(session.user));
        }
      }
    } catch (err: any) {
      console.error('CRITICAL APP INITIALIZATION ERROR:', err);
      setError('network');
    } finally {
      setIsInitialized(true);
      window.WebApp?.ready();
      if (!sessionFound && ![ROUTES.AUTH, ROUTES.ONBOARDING].includes(location.pathname)) {
        navigate(ROUTES.AUTH);
      }
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);
  
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

  const EventChatPageWrapper = () => {
    const { id } = useParams();
    return <EventChatPage eventId={parseInt(id || '0', 10)} user={userData!} onBack={() => navigate(ROUTES.EVENT_DETAIL(id!))} />;
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
  const CreateEventPageWrapper = () => <CreateEventPage user={userData!} onBack={() => navigate(ROUTES.ORGANIZATION_EVENTS)} onPublish={() => {
    showToast(MESSAGES.TOASTS.EVENT_PUBLISHED, 'success');
    navigate(ROUTES.ORGANIZATION_EVENTS);
  }} />;
  const EditEventPageWrapper = () => {
    const { eventId } = useParams<{ eventId: string }>();
    return <CreateEventPage user={userData!} event={{ id: parseInt(eventId!, 10) } as OrganizationEvent} onBack={() => navigate(ROUTES.ORGANIZATION_EVENTS)} onPublish={() => {
      showToast(MESSAGES.TOASTS.EVENT_SAVED, 'success');
      navigate(ROUTES.ORGANIZATION_EVENTS);
    }} />;
  };
  const EventParticipantsPageWrapper = () => <EventParticipantsPage user={userData!} onBack={() => navigate(ROUTES.ORGANIZATION_EVENTS)} />;
  const OrganizationSettingsPageWrapper = () => <OrganizationSettingsPage onBack={() => navigate(ROUTES.ORGANIZATION_DASHBOARD)} onLogout={handleLogout} />;
  
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
        { path: ROUTES.ORGANIZATION_DASHBOARD, element: <OrganizationDashboardPage user={userData} onSwitchToVolunteer={() => navigate(ROUTES.HOME)} onManageEvents={() => navigate(ROUTES.ORGANIZATION_EVENTS)} onCreateEvent={() => navigate(ROUTES.ORGANIZATION_EVENTS_CREATE)} onNavigateToSettings={() => navigate(ROUTES.ORGANIZATION_SETTINGS)} /> },
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

  if (!isInitialized) {
    return <SplashPage />;
  }
  
  if (isAuthenticated && (!userData || allCourses.length === 0)) {
    return <SplashPage />;
  }

  if (error) {
    return <ErrorPage type={error} onRetry={initializeApp} />;
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
};

export default App;
