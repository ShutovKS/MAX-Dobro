import * as realApi from './api.real';
import * as mockApi from './api.mock';
import * as organizerApi from './api.organizer';

const isReal = import.meta.env.VITE_API_MODE === 'real';

const api = isReal ? realApi : mockApi;

/** <context:frontend_api_adapter> Keeps mock and real API surfaces aligned for the app shell. </context:frontend_api_adapter> */

export const fetchOrganizationDashboardStats = mockApi.fetchOrganizationDashboardStats;
export const fetchOrganizationDetails = mockApi.fetchOrganizationDetails;
export const fetchOrganizationEvents = mockApi.fetchOrganizationEvents;
export const fetchEventParticipants = mockApi.fetchEventParticipants;

export const fetchAllStories = mockApi.fetchAllStories;
export const fetchStoryById = mockApi.fetchStoryById;

export const {
  fetchAllEvents,
  fetchEventById,
  participateInEvent,
  cancelEventParticipation,
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
  purchaseReward,
  fetchMapMarkers,
  fetchFriends,
  fetchEventChatMessages,
  fetchWeeklyChallenge,
  completeCourse,
} = api;
