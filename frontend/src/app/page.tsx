import React, {useEffect, useState} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams} from 'react-router';

// Page Imports
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
import MyChatsPage from './profile/chats/page';
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

import type {Course, OrganizationEvent, RewardItem, User} from '../lib/types';
import {fetchAllCourses, fetchRewards} from '../lib/api';
import {getCurrentSession, isOnboardingComplete, logout, setOnboardingComplete} from '../lib/auth';


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
          navigate('/onboarding');
        } else if (['', '/', '#/', '/auth'].includes(location.pathname)) {
          navigate('/home');
        }
      } else {
        navigate('/auth');
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
    // Decide navigation based on onboarding status
    if (!isOnboardingComplete()) {
      navigate('/onboarding');
    } else {
      navigate('/home');
    }
  };

  const handleOnboardingComplete = () => {
    setOnboardingComplete();
    navigate('/home');
  };

  const handleLogout = async () => {
    await logout();
    setUserData(null);
    navigate('/auth');
  }

  const handleSaveProfile = (updatedUser: User) => {
    setUserData(updatedUser);
    navigate('/profile/settings');
  }

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({show: true, message, type});
  };

  // --- Wrapper Components for Pages ---
  const EventChatPageWrapper = () => {
    const {id} = useParams();
    return <EventChatPage eventId={parseInt(id || '0', 10)} user={userData!} onBack={() => navigate(`/events/${id}`)}/>;
  };

  const CourseDetailPageWrapper = () => {
    const {id} = useParams();
    return <CourseDetailPage id={parseInt(id || '0', 10)}/>;
  };

  const LessonPageWrapper = () => {
    const {id, subId} = useParams();
    const courseId = parseInt(id || '0', 10);
    return <LessonPage courseId={courseId} lessonIndex={parseInt(subId || '0', 10)} allCourses={allCourses}
                       onClose={() => navigate(`/courses/${courseId}`)}
                       onComplete={(cId) => navigate(`/courses/${cId}/certificate`)}/>;
  };

  const CertificatePageWrapper = () => {
    const {id} = useParams();
    const courseId = parseInt(id || '0', 10);
    return <CertificatePage courseId={courseId} allCourses={allCourses} user={userData!}
                            onBack={() => navigate(`/courses/${courseId}`)}/>;
  };

  const OrganizationProfilePageWrapper = () => {
    const {id} = useParams();
    return <OrganizationProfilePage id={parseInt(id || '0', 10)}/>;
  };

  const CreateStoryPageWrapper = () => {
    const [searchParams] = useSearchParams();
    return <CreateStoryPage onCancel={() => navigate('/stories')} onPublish={() => {
      showToast('Ваша история опубликована!', 'success');
      navigate('/stories');
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
      showToast('Поздравляем с покупкой!', 'success');
      navigate('/profile/rewardsStore');
    }}/>;
  };

  const LeaderboardPageWrapper = () => <LeaderboardPage user={userData!} onBack={() => navigate('/profile')}/>;
  const SettingsPageWrapper = () => <SettingsPage onBack={() => navigate('/profile')} onLogout={handleLogout}/>;
  const EditProfilePageWrapper = () => <EditProfilePage user={userData!} onCancel={() => navigate('/profile/settings')}
                                                        onSave={handleSaveProfile}/>;
  const MyCertificatesPageWrapper = () => <MyCertificatesPage user={userData!} onBack={() => navigate('/profile')}
                                                              onSelectCertificate={(courseId) => navigate(`/courses/${courseId}/certificate`)}
                                                              onGoToTraining={() => navigate('/training')}/>;
  const RewardsStorePageWrapper = () => <RewardsStorePage user={userData!} rewards={allRewards}
                                                          onBack={() => navigate('/profile')}/>;

  const EventManagementPageWrapper = () => <EventManagementPage onBack={() => setAppMode('volunteer')}
                                                                onCreateEvent={() => navigate('/organization-events/create')}
                                                                onEditEvent={(e) => navigate(`/organization-events/edit/${e.id}`)}
                                                                onManageParticipants={(e) => navigate(`/organization-events/participants/${e.id}`)}/>;
  const CreateEventPageWrapper = () => <CreateEventPage onBack={() => navigate('/organization-events')}
                                                        onPublish={() => {
                                                          showToast('Событие опубликовано!', 'success');
                                                          navigate('/organization-events');
                                                        }}/>;
  const EditEventPageWrapper = () => {
    const {eventId} = useParams();
    return <CreateEventPage event={{id: parseInt(eventId!, 10)} as OrganizationEvent}
                            onBack={() => navigate('/organization-events')} onPublish={() => {
      showToast('Событие сохранено!', 'success');
      navigate('/organization-events');
    }}/>
  };
  const EventParticipantsPageWrapper = () => {
    const {eventId} = useParams();
    return <EventParticipantsPage event={{id: parseInt(eventId!, 10)} as OrganizationEvent}
                                  onBack={() => navigate('/organization-events')}/>;
  };

  const renderRoutes = () => {
    if (appMode === 'organization') {
      return (
        <Routes>
          <Route path="/organization-dashboard"
                 element={<OrganizationDashboardPage onSwitchToVolunteer={() => setAppMode('volunteer')}
                                                     onManageEvents={() => navigate('/organization-events')}
                                                     onCreateEvent={() => navigate('/organization-events/create')}/>}/>
          <Route path="/organization-events" element={<EventManagementPageWrapper/>}/>
          <Route path="/organization-events/create" element={<CreateEventPageWrapper/>}/>
          <Route path="/organization-events/edit/:eventId" element={<EditEventPageWrapper/>}/>
          <Route path="/organization-events/participants/:eventId" element={<EventParticipantsPageWrapper/>}/>
          <Route path="*" element={<Navigate to="/organization-dashboard" replace/>}/>
        </Routes>
      );
    }

    if (!isAuthenticated) {
      return (
        <Routes>
          <Route path="/auth" element={<AuthPage onAuthSuccess={handleAuthSuccess}/>}/>
          <Route path="/onboarding" element={<OnboardingPage onComplete={handleOnboardingComplete}/>}/>
          <Route path="*" element={<Navigate to="/auth" replace/>}/>
        </Routes>
      );
    }

    if (!userData || !allCourses) {
      return <SplashPage/>;
    }

    return (
      <Routes>
        <Route path="/home" element={<TabsLayout user={userData} activeTab="home"
                                                 onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>
        <Route path="/training" element={<TabsLayout user={userData} activeTab="training"
                                                     onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>
        <Route path="/organizations" element={<TabsLayout user={userData} activeTab="organizations"
                                                          onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>
        <Route path="/stories" element={<TabsLayout user={userData} activeTab="stories"
                                                    onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>
        <Route path="/profile" element={<TabsLayout user={userData} activeTab="profile"
                                                    onSwitchToOrganizationMode={() => setAppMode('organization')}/>}/>

        <Route path="/events/:id/chat" element={<EventChatPageWrapper/>}/>
        <Route path="/events/:id" element={<EventDetailPage/>}/>
        <Route path="/courses/:id/lesson/:subId" element={<LessonPageWrapper/>}/>
        <Route path="/courses/:id/certificate" element={<CertificatePageWrapper/>}/>
        <Route path="/courses/:id" element={<CourseDetailPageWrapper/>}/>
        <Route path="/organizations/:id" element={<OrganizationProfilePageWrapper/>}/>
        <Route path="/stories/create" element={<CreateStoryPageWrapper/>}/>
        <Route path="/stories/:id" element={<StoryDetailPageWrapper/>}/>
        <Route path="/rewards/:id" element={<RewardsDetailPageWrapper/>}/>
        <Route path="/chat" element={<AssistantChatPage onClose={() => navigate('/home')} user={userData}/>}/>

        <Route path="/profile/activityHistory" element={<ActivityHistoryPage/>}/>
        <Route path="/profile/allAchievements" element={<AllAchievementsPage/>}/>
        <Route path="/profile/calendar" element={<CalendarPage/>}/>
        <Route path="/profile/leaderboards" element={<LeaderboardPageWrapper/>}/>
        <Route path="/profile/settings" element={<SettingsPageWrapper/>}/>
        <Route path="/profile/editProfile" element={<EditProfilePageWrapper/>}/>
        <Route path="/profile/myCertificates" element={<MyCertificatesPageWrapper/>}/>
        <Route path="/profile/myChats" element={<MyChatsPage/>}/>
        <Route path="/profile/rewardsStore" element={<RewardsStorePageWrapper/>}/>

        <Route path="/" element={<Navigate to="/home" replace/>}/>

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
