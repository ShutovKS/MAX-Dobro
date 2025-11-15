import * as realApi from './api.real';
import * as mockApi from './api.mock';
import * as organizerApi from './api.organizer';

const isReal = import.meta.env.VITE_API_MODE === 'real';

const api = isReal ? realApi : mockApi;

// Экспортируем все обычные функции
export const {
  fetchAllEvents,
  fetchEventById,
  fetchAllCourses,
  fetchCourseById,
  fetchAllOrganizations,
  updateOrganizationSubscription,
  fetchOrganizationById,
  fetchActivityHistoryEvents,
  fetchLeaderboardData,
  fetchAllAchievements,
  fetchUserAchievements,
  fetchMyChats,
  fetchAllStories,
  fetchStoryById,
  fetchRewards,
  fetchMapMarkers,
  fetchFriends,
  fetchEventChatMessages,
  fetchWeeklyChallenge,
  completeCourse,
} = api;

// А функции организатора экспортируем из нашего "переключателя"
export const {
  fetchOrganizationDashboardStats,
  fetchOrganizationDetails,
  fetchOrganizationEvents,
  fetchEventParticipants,
} = organizerApi;