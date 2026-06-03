import * as realApi from './api.real';
import * as mockApi from './api.mock';
import * as organizerApi from './api.organizer';

const isReal = import.meta.env.VITE_API_MODE === 'real';

const api = isReal ? realApi : mockApi;

/** <context:frontend_api_adapter> Keeps mock and real API surfaces aligned for the app shell. </context:frontend_api_adapter> */

export const fetchOrganizationDashboardStats = organizerApi.fetchOrganizationDashboardStats;
export const fetchOrganizationDetails = organizerApi.fetchOrganizationDetails;
export const fetchOrganizationEvents = organizerApi.fetchOrganizationEvents;
export const fetchEventParticipants = organizerApi.fetchEventParticipants;

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
  createEventReview,
  fetchAllStories,
  fetchStoryById,
  createStory,
  likeStory,
  unlikeStory,
  fetchAssistantChatMessages,
  postAssistantMessage,
  fetchMyChats,
  fetchRewards,
  purchaseReward,
  fetchMapMarkers,
  fetchFriends,
  fetchEventChatMessages,
  postEventChatMessage,
  fetchWeeklyChallenge,
  completeCourse,
  markLessonComplete,
  updateProfile,
} = api;
