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
import {BookOpen, Clock, Dog, GraduationCap, HandHeart, Leaf, List, Palette, Star, Trophy, Users} from 'lucide-react';
import React from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const iconMap: { [key: string]: React.FC<any> } = {
  'hand-heart': HandHeart,
  'dog': Dog,
  'leaf': Leaf,
  'users': Users,
  'palette': Palette,
  'trophy': Trophy,
  'clock': Clock,
  'star': Star,
  'graduation-cap': GraduationCap,
  'list': List,
  'default': Star,
};

const getIcon = (iconName?: string | null): React.FC<any> => {
  if (!iconName) return iconMap['default'];
  return iconMap[iconName] || iconMap['default'];
};

const categoryIconMap: { [key: string]: React.FC<any> } = {
  'Экология': Leaf,
  'Животные': Dog,
  'Помощь старшим': HandHeart,
  'Арт': Palette,
  'Онлайн': BookOpen,
  'Спорт': Trophy,
  'Культура': Palette,
  'Дети': Users,
  'default': Star,
};

const getIconForCategory = (category?: string | null): React.FC<any> => {
  if (!category) return categoryIconMap['default'];
  return categoryIconMap[category] || categoryIconMap['default'];
};

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

// Helper for mapping icon property
const mapIcon = <T extends { icon?: string | null }>(item: T): Omit<T, 'icon'> & { Icon: React.FC<any> } => {
  const {icon, ...rest} = item;
  return {...rest, Icon: getIcon(icon)};
};

const mapEventData = (event: any): AppEvent => ({
  ...event,
  Icon: getIconForCategory(event.category),
  participantCount: event._count?.participants ?? 0,
  organizationName: event.organization?.name ?? 'Организация', // Placeholder
  pos: {top: '0', left: '0'}, // Dummy value, not used
});

export const fetchAllEvents = async (): Promise<AppEvent[]> => {
  const events = await apiFetch<any[]>('/events');
  return events.map(mapEventData);
};

export const fetchEventById = async (id: number): Promise<AppEvent | HistoryEvent> => {
  const event = await apiFetch<any>(`/events/${id}`);
  return mapEventData(event);
};

export const fetchAllCourses = async (): Promise<Course[]> => {
  const courses = await apiFetch<(Omit<Course, 'Icon'> & { icon?: string | null })[]>('/courses');
  return courses.map(mapIcon);
};

export const fetchCourseById = async (id: number): Promise<Course> => {
  const course = await apiFetch<Omit<Course, 'Icon'> & { icon?: string | null }>(`/courses/${id}`);
  return mapIcon(course);
};

export const fetchAllOrganizations = (): Promise<Organization[]> => apiFetch('/organizations');
export const fetchOrganizationById = (id: number): Promise<Organization> => apiFetch(`/organizations/${id}`);

export const updateOrganizationSubscription = (organizationId: number, isSubscribed: boolean): Promise<Organization> => {
  return apiFetch(`/organizations/${organizationId}/subscription`, {
    method: 'POST',
    body: JSON.stringify({isSubscribed}),
  });
};

export const fetchOrganizationEvents = (): Promise<OrganizationEvent[]> => apiFetch(`/organization/events`);
export const fetchEventParticipants = (eventId: number): Promise<EventParticipant[]> => apiFetch(`/organization/events/${eventId}/participants`);

export const fetchOrganizationDashboardStats = (): Promise<OrganizationStat[]> => apiFetch(`/organization/dashboard/stats`);
export const fetchOrganizationDetails = (): Promise<OrganizationDetails> => apiFetch(`/organization/details`);

export const fetchActivityHistoryEvents = async (): Promise<HistoryEvent[]> => {
  const data = await apiFetch<{ upcoming: any[], past: any[] }>('/profile/me/events');
  const upcoming = data.upcoming.map(event => ({...mapEventData(event), status: 'upcoming' as const}));
  const past = data.past.map(event => ({...mapEventData(event), status: 'past' as const}));
  return [...upcoming, ...past];
};

export const fetchLeaderboardData = (period: 'week' | 'month' | 'allTime'): Promise<LeaderboardUser[]> => apiFetch(`/leaderboard?period=${period}`);

export const fetchAllAchievements = async (): Promise<Achievement[]> => {
  const achievements = await apiFetch<(Omit<Achievement, 'Icon'> & { icon?: string | null })[]>('/achievements');
  return achievements.map(mapIcon);
};

export const fetchMyChats = async (): Promise<MyChatItem[]> => {
  const chats = await apiFetch<any[]>('/profile/chats');
  return chats.map(chat => ({...chat, Icon: getIconForCategory(chat.category)}));
};

export const fetchAllStories = (): Promise<Story[]> => apiFetch('/stories');
export const fetchStoryById = (id: number): Promise<Story> => apiFetch(`/stories/${id}`);

export const fetchRewards = (): Promise<RewardItem[]> => apiFetch('/rewards');

export const fetchMapMarkers = (): Promise<MapMarker[]> => apiFetch('/map-markers');

export const fetchFriends = (): Promise<Friend[]> => apiFetch('/friends');
export const fetchEventChatMessages = (eventId: number): Promise<EventChatMessage[]> => apiFetch(`/events/${eventId}/messages`);

export const fetchWeeklyChallenge = async (): Promise<WeeklyChallenge> => {
  const challenge = await apiFetch<Omit<WeeklyChallenge, 'Icon'> & { icon?: string | null }>('/challenge/weekly');
  return mapIcon(challenge);
};