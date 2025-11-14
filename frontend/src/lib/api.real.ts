import {supabase} from './auth.real';
import type {
  Achievement,
  AppEvent,
  Course,
  EventChatMessage,
  EventParticipant,
  Friend,
  HistoryEvent,
  LeaderboardUser,
  MapMarker,
  MyChatItem,
  Organization,
  OrganizationDetails,
  OrganizationEvent,
  OrganizationStat,
  RewardItem,
  Story,
  WeeklyChallenge
} from './types';

const API_BASE_URL = process.env.API_BASE_URL;

const getAuthToken = async (): Promise<string | null> => {
  if (!supabase) return null;
  const {data} = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getAuthToken();
  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({message: 'Server error'}));
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
}

export const fetchAllEvents = (): Promise<AppEvent[]> => apiFetch('/events');
export const fetchEventById = (id: number): Promise<AppEvent | HistoryEvent> => apiFetch(`/events/${id}`);

export const fetchAllCourses = (): Promise<Course[]> => apiFetch('/courses');
export const fetchCourseById = (id: number): Promise<Course> => apiFetch(`/courses/${id}`);

export const fetchAllOrganizations = (): Promise<Organization[]> => apiFetch('/organizations');
export const fetchOrganizationById = (id: number): Promise<Organization> => apiFetch(`/organizations/${id}`);

export const updateOrganizationSubscription = (organizationId: number, isSubscribed: boolean): Promise<Organization> => {
  return apiFetch(`/organizations/${organizationId}/subscription`, {
    method: 'POST',
    body: JSON.stringify({isSubscribed}),
  });
};

export const fetchOrganizationEvents = (organizationId: number): Promise<OrganizationEvent[]> => apiFetch(`/organizations/${organizationId}/events`);
export const fetchEventParticipants = (eventId: number): Promise<EventParticipant[]> => apiFetch(`/organization/events/${eventId}/participants`);

export const fetchOrganizationDashboardStats = (organizationId: number): Promise<OrganizationStat[]> => apiFetch(`/organizations/${organizationId}/dashboard`);
export const fetchOrganizationDetails = (organizationId: number): Promise<OrganizationDetails> => apiFetch(`/organizations/${organizationId}`);

export const fetchActivityHistoryEvents = (): Promise<HistoryEvent[]> => apiFetch('/profile/me/events');
export const fetchLeaderboardData = (period: 'week' | 'month' | 'allTime'): Promise<LeaderboardUser[]> => apiFetch(`/leaderboard?period=${period}`);
export const fetchAllAchievements = (): Promise<Achievement[]> => apiFetch('/achievements');
export const fetchMyChats = (): Promise<MyChatItem[]> => apiFetch('/profile/chats');

export const fetchAllStories = (): Promise<Story[]> => apiFetch('/stories');
export const fetchStoryById = (id: number): Promise<Story> => apiFetch(`/stories/${id}`);

export const fetchRewards = (): Promise<RewardItem[]> => apiFetch('/rewards');

export const fetchMapMarkers = (): Promise<MapMarker[]> => apiFetch('/map-markers');

export const fetchFriends = (): Promise<Friend[]> => apiFetch('/friends');
export const fetchEventChatMessages = (eventId: number): Promise<EventChatMessage[]> => apiFetch(`/events/${eventId}/messages`);

export const fetchWeeklyChallenge = (): Promise<WeeklyChallenge> => apiFetch('/challenge/weekly');