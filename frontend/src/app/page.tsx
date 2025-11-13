import React, {useEffect, useState} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams} from 'react-router';

import SplashPage from './splash/page';
import AuthPage from './auth/page';
import OnboardingPage from './onboarding/page';
import TabsLayout from './tabs/layout';
import EventDetailPage from './events/detail/page';
import CourseDetailPage from './courses/detail/page';
import OrganizationProfilePage from './organizations/detail/page';
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

// FIX: Import RewardItem type to resolve typing error for allRewards state.
import type {Course, OrganizationEvent, RewardItem, User} from '../lib/types';
import {fetchAllCourses, fetchRewards} from '../lib/api';
import {getCurrentSession, isOnboardingComplete, logout, setOnboardingComplete} from '../lib/auth';
import {MESSAGES, ROUTES} from '../lib/constants';


type AppMode = 'volunteer' | 'organization';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>('volunteer');
  const [error, setError] = useState<'network' | 'server' | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [allRewards, setAllRewards] = useState<RewardItem[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string; type?: 'success' | 'info' }>({
    show: false,
    message: ''
  });

  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!userData;

  const initializeApp = async () => {
    setError(null);
    try {
      const rewardsPromise = fetchRewards();
      const coursesPromise = fetchAllCourses();

      const session = await getCurrentSession();
      const onboardingComplete = isOnboardingComplete();

      const [rewards, courses] = await Promise.all([rewardsPromise, coursesPromise]);

      setAllRewards(rewards);
      setAllCourses(courses);

      if (session) {
        setUserData(session.user);
        if (!onboardingComplete) {
          navigate(ROUTES.ONBOARDING);
        } else if (['', '/', '#/', ROUTES.AUTH].includes(location.pathname)) {
          navigate(ROUTES.HOME);
        }
      } else {
        navigate(ROUTES.AUTH);
      }
      setIsInitialized(true);

    } catch (err) {
      setError('network');
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const handleAuthSuccess = (user: User) => {
    setUserData(user);
    if (!isOnboardingComplete()) {
      navigate(ROUTES.ONBOARDING);
    } else {
      navigate(ROUTES.HOME);
    }
  };

  const handleOnboardingComplete = () => {
    setOnboardingComplete();
    navigate(ROUTES.HOME);
  };

  const handleLogout = async () => {
    await logout();
    setUserData(null);
    navigate(ROUTES.AUTH);
  }

  const handleSaveProfile = (updatedUser: User) => {
    setUserData(updatedUser);
    navigate(ROUTES.PROFILE_SETTINGS);
  }

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({show: true, message, type});
  };

  const EventChatPageWrapper = () => {
    const {id} = useParams();
    return <EventChatPage eventId={parseInt(id || '0', 10)} user={userData!}
                          onBack={() => navigate(ROUTES.EVENT_DETAIL(id!))}/>;
  };

  const CourseDetailPageWrapper = () => {
    const {id} = useParams();
    return <CourseDetailPage id={parseInt(id || '0', 10)}/>;
  };

  const LessonPageWrapper = () => {
    const {id, subId} = useParams();
    const courseId = parseInt(id || '0', 10);
    return <LessonPage courseId={courseId} lessonIndex={parseInt(subId || '0', 10)} allCourses={allCourses}
                       onClose={() => navigate(ROUTES.COURSE_DETAIL(courseId))}
                       onComplete={(cId) => navigate(ROUTES.COURSE_CERTIFICATE(cId))}/>;
  };

  const CertificatePageWrapper = () => {
    const {id} = useParams();
    const courseId = parseInt(id || '0', 10);
    return <CertificatePage courseId={courseId} allCourses={allCourses} user={userData!}
                            onBack={() => navigate(ROUTES.COURSE_DETAIL(courseId))}/>;
  };

  const OrganizationProfilePageWrapper = () => {
    const {id} = useParams();
    return <OrganizationProfilePage id={parseInt(id || '0', 10)}/>;
  };

  const CreateStoryPageWrapper = () => {
    const [searchParams] = useSearchParams();
    return <CreateStoryPage onCancel={() => navigate(ROUTES.STORIES)} onPublish={() => {
      showToast(MESSAGES.TOASTS.STORY_PUBLISHED, 'success');
      navigate(ROUTES.STORIES);
    }} initialEventId={searchParams.get('eventId')}/>;
  };

  const StoryDetailPageWrapper = () => {
    const {id} = useParams();
    return <StoryDetailPage id={parseInt(id || '0', 10)} currentUserAvatar={userData!.avatarUrl}/>;
  };

  const RewardsDetailPageWrapper = () => {
    const {id} = useParams();
    const rewardId = parseInt(id || '0', 10);
    return <RewardsDetailPage rewardId={rewardId} allRewards={allRewards} user={userData!} onPurchase={(rId) => {
      setAllRewards(prev => prev.map(r => r.id === rId ? {...r, isPurchased: true} : r));
      showToast(MESSAGES.TOASTS.REWARD_PURCHASED, 'success');
      navigate(ROUTES.PROFILE_REWARDS);
    }}/>;
  };

  const LeaderboardPageWrapper = () => <LeaderboardPage user={userData!} onBack={() => navigate(ROUTES.PROFILE)}/>;
  const SettingsPageWrapper = () => <SettingsPage onBack={() => navigate(ROUTES.PROFILE)} onLogout={handleLogout}/>;
  const EditProfilePageWrapper = () => <EditProfilePage user={userData!}
                                                        onCancel={() => navigate(ROUTES.PROFILE_SETTINGS)}
                                                        onSave={handleSaveProfile}/>;
  const MyCertificatesPageWrapper = () => <MyCertificatesPage user={userData!} onBack={() => navigate(ROUTES.PROFILE)}
                                                              onSelectCertificate={(courseId) => navigate(ROUTES.COURSE_CERTIFICATE(courseId))}
                                                              onGoToTraining={() => navigate(ROUTES.TRAINING)}/>;
  const RewardsStorePageWrapper = () => <RewardsStorePage user={userData!} rewards={allRewards}
                                                          onBack={() => navigate(ROUTES.PROFILE)}/>;

  const EventManagementPageWrapper = () => <EventManagementPage onBack={() => setAppMode('volunteer')}
                                                                onCreateEvent={() => navigate(ROUTES.ORGANIZATION_EVENTS_CREATE)}
                                                                onEditEvent={(e) => navigate(ROUTES.ORGANIZATION_EVENTS_EDIT(e.id))}
                                                                onManageParticipants={(e) => navigate(ROUTES.ORGANIZATION_EVENTS_PARTICIPANTS(e.id))}/>;
  const CreateEventPageWrapper = () => <CreateEventPage onBack={() => navigate(ROUTES.ORGANIZATION_EVENTS)}
                                                        onPublish={() => {
                                                          showToast(MESSAGES.TOASTS.EVENT_PUBLISHED, 'success');
                                                          navigate(ROUTES.ORGANIZATION_EVENTS);
                                                        }}/>;
  const EditEventPageWrapper = () => {
    const {eventId} = useParams<{ eventId: string }>();
    return <CreateEventPage event={{id: parseInt(eventId!, 10)} as OrganizationEvent}
                            onBack={() => navigate(ROUTES.ORGANIZATION_EVENTS)} onPublish={() => {
      showToast(MESSAGES.TOASTS.EVENT_SAVED, 'success');
      navigate(ROUTES.ORGANIZATION_EVENTS);
    }}/>
  };
  const EventParticipantsPageWrapper = () => <EventParticipantsPage
    onBack={() => navigate(ROUTES.ORGANIZATION_EVENTS)}/>;

  const renderRoutes = () => {
    if (appMode === 'organization') {
      return (
        <Routes>
          <Route path={ROUTES.ORGANIZATION_DASHBOARD}
                 element={<OrganizationDashboardPage onSwitchToVolunteer={() => setAppMode('volunteer')}
                                                     onManageEvents={() => navigate(ROUTES.ORGANIZATION_EVENTS)}
                                                     onCreateEvent={() => navigate(ROUTES.ORGANIZATION_EVENTS_CREATE)}/>}/>
          <Route path={ROUTES.ORGANIZATION_EVENTS} element={<EventManagementPageWrapper/>}/>
          <Route path={ROUTES.ORGANIZATION_EVENTS_CREATE} element={<CreateEventPageWrapper/>}/>
          <Route path={ROUTES.ORGANIZATION_EVENTS_EDIT(':eventId')} element={<EditEventPageWrapper/>}/>
          <Route path={ROUTES.ORGANIZATION_EVENTS_PARTICIPANTS(':eventId')} element={<EventParticipantsPageWrapper/>}/>
          <Route path="*" element={<Navigate to={ROUTES.ORGANIZATION_DASHBOARD} replace/>}/>
        </Routes>
      );
    }

    if (!isAuthenticated) {
      return (
        <Routes>
          <Route path={ROUTES.AUTH} element={<AuthPage onAuthSuccess={handleAuthSuccess}/>}/>
          <Route path={ROUTES.ONBOARDING} element={<OnboardingPage onComplete={handleOnboardingComplete}/>}/>
          <Route path="*" element={<Navigate to={ROUTES.AUTH} replace/>}/>
        </Routes>
      );
    }

    if (!userData || !allCourses) {
      return <SplashPage/>;
    }

    return (
      <Routes>
        <Route path={ROUTES.HOME} element={<TabsLayout user={userData} activeTab="home"
                                                       onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>
        <Route path={ROUTES.TRAINING} element={<TabsLayout user={userData} activeTab="training"
                                                           onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>
        <Route path={ROUTES.ORGANIZATIONS} element={<TabsLayout user={userData} activeTab="organizations"
                                                                onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>
        <Route path={ROUTES.STORIES} element={<TabsLayout user={userData} activeTab="stories"
                                                          onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>
        <Route path={ROUTES.PROFILE} element={<TabsLayout user={userData} activeTab="profile"
                                                          onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>

        <Route path={ROUTES.EVENT_CHAT(':id')} element={<EventChatPageWrapper/>}/>
        <Route path={ROUTES.EVENT_DETAIL(':id')} element={<EventDetailPage/>}/>
        <Route path={ROUTES.COURSE_LESSON(':id', ':subId')} element={<LessonPageWrapper/>}/>
        <Route path={ROUTES.COURSE_CERTIFICATE(':id')} element={<CertificatePageWrapper/>}/>
        <Route path={ROUTES.COURSE_DETAIL(':id')} element={<CourseDetailPageWrapper/>}/>
        <Route path={ROUTES.ORGANIZATION_DETAIL(':id')} element={<OrganizationProfilePageWrapper/>}/>
        <Route path={ROUTES.STORY_CREATE} element={<CreateStoryPageWrapper/>}/>
        <Route path={ROUTES.STORY_DETAIL(':id')} element={<StoryDetailPageWrapper/>}/>
        <Route path={ROUTES.REWARD_DETAIL(':id')} element={<RewardsDetailPageWrapper/>}/>
        <Route path={ROUTES.CHAT} element={<AssistantChatPage onClose={() => navigate(ROUTES.HOME)} user={userData}/>}/>

        <Route path={ROUTES.PROFILE_ACTIVITY_HISTORY} element={<ActivityHistoryPage/>}/>
        <Route path={ROUTES.PROFILE_ACHIEVEMENTS} element={<AllAchievementsPage/>}/>
        <Route path={ROUTES.PROFILE_CALENDAR} element={<CalendarPage/>}/>
        <Route path={ROUTES.PROFILE_LEADERBOARDS} element={<LeaderboardPageWrapper/>}/>
        <Route path={ROUTES.PROFILE_SETTINGS} element={<SettingsPageWrapper/>}/>
        <Route path={ROUTES.PROFILE_EDIT} element={<EditProfilePageWrapper/>}/>
        <Route path={ROUTES.PROFILE_CERTIFICATES} element={<MyCertificatesPageWrapper/>}/>
        <Route path={ROUTES.PROFILE_CHATS} element={<MyChatsPage/>}/>
        <Route path={ROUTES.PROFILE_REWARDS} element={<RewardsStorePageWrapper/>}/>

        <Route path="/" element={<Navigate to={ROUTES.HOME} replace/>}/>

        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    );
  };

  if (error) return <ErrorPage type={error} onRetry={initializeApp}/>;

  if (!isInitialized) return <SplashPage/>;

  return (
    <>
      {renderRoutes()}
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast(prev => ({...prev, show: false}))}
        type={toast.type || 'info'}
      />
    </>
  );
};

export default App;
