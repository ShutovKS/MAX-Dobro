import * as realApi from './api.real';
import * as mockApi from './api.mock';

const isReal = import.meta.env.VITE_API_MODE === 'real';

const api = isReal ? realApi : mockApi;

export const fetchOrganizationDashboardStats = mockApi.fetchOrganizationDashboardStats;
export const fetchOrganizationDetails = mockApi.fetchOrganizationDetails;
export const fetchOrganizationEvents = mockApi.fetchOrganizationEvents;
export const fetchEventParticipants = mockApi.fetchEventParticipants;

export const fetchAllStories = mockApi.fetchAllStories;
export const fetchStoryById = mockApi.fetchStoryById;

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
  fetchRewards,
  fetchMapMarkers,
  fetchFriends,
  fetchEventChatMessages,
  fetchWeeklyChallenge,
  completeCourse,
} = api;