import * as realApi from './api.real';
import * as mockApi from './api.mock';

const isReal = import.meta.env.VITE_API_MODE === 'real';

const api = isReal ? realApi : mockApi;

export const {
  fetchAllEvents,
  fetchEventById,
  fetchAllCourses,
  fetchCourseById,
  fetchAllOrganizations,
  updateOrganizationSubscription,
  fetchOrganizationById,
  fetchOrganizationEvents,
  fetchEventParticipants,
  fetchActivityHistoryEvents,
  fetchLeaderboardData,
  fetchAllAchievements,
  fetchMyChats,
  fetchAllStories,
  fetchStoryById,
  fetchRewards,
  fetchMapMarkers,
  fetchFriends,
  fetchEventChatMessages,
  fetchOrganizationDashboardStats,
  fetchOrganizationDetails,
  fetchWeeklyChallenge,
  completeCourse,
} = api;