// FILE: frontend/src/lib/api.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Select mock or real HTTP adapters so screens share one API surface.
//   SCOPE: VITE_API_MODE switch, volunteer API re-exports, organizer API re-exports
//   DEPENDS: M-FRONTEND-AUTH M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-API V-M-FRONTEND-API
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   adapter selection - picks api.real or api.mock from VITE_API_MODE
//   volunteer API surface - re-exports fetch and mutate helpers from the selected adapter
//   organizer API surface - re-exports organization dashboard helpers from api.organizer
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import * as realApi from './api.real';
import * as mockApi from './api.mock';
import * as organizerApi from './api.organizer';

// START_BLOCK_SELECT_ADAPTER
const isReal = import.meta.env.VITE_API_MODE === 'real';

const api = isReal ? realApi : mockApi;
// END_BLOCK_SELECT_ADAPTER

export const fetchOrganizationDashboardStats = organizerApi.fetchOrganizationDashboardStats;
export const fetchOrganizationDetails = organizerApi.fetchOrganizationDetails;
export const fetchOrganizationEvents = organizerApi.fetchOrganizationEvents;
export const fetchEventParticipants = organizerApi.fetchEventParticipants;

export const {
  fetchAllEvents,
  fetchEventById,
  createEvent,
  updateEvent,
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
  createStoryComment,
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
