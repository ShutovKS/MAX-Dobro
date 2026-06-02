import { supabase } from './auth.real';
import type {
  Achievement,
  AppEvent,
  ChatMessage,
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
  WeeklyChallenge,
} from './types';
import {
  BookOpen,
  Clock,
  Dog,
  GraduationCap,
  HandHeart,
  Leaf,
  List,
  Palette,
  Star,
  Trophy,
  Users,
} from 'lucide-react';
import React from 'react';
import { formatEventDate, formatTimestamp } from './dateUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const iconMap: { [key: string]: React.FC<any> } = {
  'hand-heart': HandHeart,
  dog: Dog,
  leaf: Leaf,
  users: Users,
  palette: Palette,
  trophy: Trophy,
  clock: Clock,
  star: Star,
  'graduation-cap': GraduationCap,
  list: List,
  default: Star,
};

const getIcon = (iconName?: string | null): React.FC<any> => {
  if (!iconName) return iconMap['default'];
  return iconMap[iconName] || iconMap['default'];
};

const categoryIconMap: { [key: string]: React.FC<any> } = {
  Экология: Leaf,
  Животные: Dog,
  'Помощь старшим': HandHeart,
  Арт: Palette,
  Онлайн: BookOpen,
  Спорт: Trophy,
  Культура: Palette,
  Дети: Users,
  default: Star,
};

const getIconForCategory = (category?: string | null): React.FC<any> => {
  if (!category) return categoryIconMap['default'];
  return categoryIconMap[category] || categoryIconMap['default'];
};

const getAuthToken = async (): Promise<string | null> => {
  const internalToken = localStorage.getItem('internal_jwt');
  if (internalToken) {
    return internalToken;
  }

  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
};

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
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
    const errorData = await response.json().catch(() => ({
      message: 'Server error',
    }));
    throw new Error(errorData.message || 'Something went wrong');
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return undefined as T;
}

const mapIcon = <T extends { icon?: string | null }>(
  item: T,
): Omit<T, 'icon'> & { Icon: React.FC<any> } => {
  const { icon, ...rest } = item;
  return { ...rest, Icon: getIcon(icon) };
};

const mapEventData = (event: any): AppEvent => ({
  ...event,
  Icon: getIconForCategory(event.category),
  participantCount: event._count?.participants ?? 0,
  organizationName: event.organization?.name ?? 'Организация',
  date: formatEventDate(event.date),
  imageUrl:
    event.imageUrl ?? `https://picsum.photos/seed/dobro-event-${event.id}/400/300`,
  pos: { top: '0', left: '0' },
});

const mapCourseData = (courseData: any): Course => {
  const courseStatus = courseData.status || 'not-started';

  const mappedProgram = (courseData.program || []).map((lesson: any) => {
    return {
      id: lesson.id,
      title: lesson.title,
      type: lesson.questions && lesson.questions.length > 0 ? 'test' : 'lesson',
      status: 'locked',
      contentTitle: lesson.title,
      content: lesson.content,
      quiz: (lesson.questions || []).map((q: any) => {
        const correctAnswersCount = q.answers.filter(
          (a: any) => a.isCorrect,
        ).length;
        return {
          id: q.id.toString(),
          question: q.question,
          type: correctAnswersCount > 1 ? 'multiple' : 'single',
          answers: q.answers,
        };
      }),
    };
  });

  let isCurrentSet = false;
  if (courseStatus === 'completed') {
    mappedProgram.forEach((l) => (l.status = 'completed'));
  } else {
    mappedProgram.forEach((l) => {
      if (!isCurrentSet) {
        l.status = 'current';
        isCurrentSet = true;
      } else {
        l.status = 'locked';
      }
    });
  }

  return {
    ...mapIcon(courseData),
    id: courseData.id,
    title: courseData.title,
    description: courseData.description,
    duration: courseData.duration || 'N/A',
    hasCertificate: courseData.hasCertificate || false,
    category: courseData.category || 'General',
    status: courseData.status || 'not-started',
    progress: courseData.progress || 0,
    level: courseData.level || 'Для новичков',
    program: mappedProgram,
  };
};

const mapStoryData = (story: any): Story => ({
  ...story,
  timestamp: formatTimestamp(story.timestamp ?? story.createdAt),
  event: {
    id: story.event.id,
    name: story.event.name ?? story.event.title,
  },
  likes: story.likes ?? story.likesCount ?? 0,
  comments: story.comments ?? story.commentsCount ?? story.commentsData?.length ?? 0,
  commentsData: (story.commentsData ?? []).map((c: any) => ({
    ...c,
    timestamp: formatTimestamp(c.timestamp ?? c.createdAt),
  })),
});

const mapAssistantMessage = (message: any): ChatMessage => ({
  id: message.id,
  sender: message.sender,
  type: message.type,
  text: message.text,
  event: message.event ? mapEventData(message.event) : undefined,
  course: message.course ? mapCourseData(message.course) : undefined,
  suggestions: message.suggestions,
  timestamp: formatTimestamp(message.createdAt),
});

export const fetchAllEvents = async (): Promise<AppEvent[]> => {
  const events = await apiFetch<any[]>('/events');
  return events.map(mapEventData);
};

export const fetchEventById = async (
  id: number,
): Promise<AppEvent | HistoryEvent> => {
  const event = await apiFetch<any>(`/events/${id}`);
  return mapEventData(event);
};

export const participateInEvent = (eventId: number): Promise<void> =>
  apiFetch(`/events/${eventId}/participate`, {
    method: 'POST',
  });

export const cancelEventParticipation = (eventId: number): Promise<void> =>
  apiFetch(`/events/${eventId}/participate`, {
    method: 'DELETE',
  });

export const fetchAllCourses = async (): Promise<Course[]> => {
  const coursesData = await apiFetch<any[]>('/profile/me/courses');
  return coursesData.map(mapCourseData);
};

export const fetchCourseById = async (
  id: number,
): Promise<Course | undefined> => {
  const allUserCourses = await fetchAllCourses();
  return allUserCourses.find((c) => c.id === id);
};

export const completeCourse = async (
  courseId: number,
  answers: { questionId: number; answerId: number }[],
): Promise<{ isPassed: boolean; score: number; totalQuestions: number }> => {
  return await apiFetch(`/courses/${courseId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
};

export const fetchAllOrganizations = (): Promise<Organization[]> =>
  apiFetch('/organizations');
export const fetchOrganizationById = (id: number): Promise<Organization> =>
  apiFetch(`/organizations/${id}`);
export const updateOrganizationSubscription = (
  organizationId: number,
  isSubscribed: boolean,
): Promise<void> => {
  return apiFetch(`/organizations/${organizationId}/subscription`, {
    method: 'POST',
    body: JSON.stringify({ isSubscribed }),
  });
};
export const fetchOrganizationEvents = (): Promise<OrganizationEvent[]> =>
  apiFetch(`/organization/events`);
export const fetchEventParticipants = (
  eventId: number,
): Promise<EventParticipant[]> =>
  apiFetch(`/organization/events/${eventId}/participants`);
export const fetchOrganizationDashboardStats = (): Promise<OrganizationStat[]> =>
  apiFetch(`/organization/dashboard/stats`);
export const fetchOrganizationDetails = (): Promise<OrganizationDetails> =>
  apiFetch(`/organization/details`);
export const fetchActivityHistoryEvents = async (): Promise<HistoryEvent[]> => {
  const data = await apiFetch<any[]>('/profile/me/events');
  return data.map((event) => ({
    ...mapEventData(event),
    status: new Date(event.date) < new Date() ? 'past' : 'upcoming',
  }));
};
export const fetchLeaderboardData = (
  period: 'week' | 'month' | 'allTime',
): Promise<{ topUsers: LeaderboardUser[]; currentUser: LeaderboardUser | null }> =>
  apiFetch(`/leaderboard?period=${period}`);
export const updateProfile = (data: {
  firstName?: string;
  lastName?: string;
  about?: string;
  avatarUrl?: string;
}): Promise<void> =>
  apiFetch('/profile/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
export const fetchAllAchievements = async (): Promise<Achievement[]> => {
  const achievements = await apiFetch<
    (Omit<Achievement, 'Icon'> & { icon?: string | null })[]
  >('/achievements');
  return achievements.map(mapIcon);
};
export const fetchUserAchievements = async (): Promise<Achievement[]> => {
  const achievements = await apiFetch<any[]>('/profile/me/achievements');
  return achievements.map((ach) => {
    const { icon, ...baseAchievement } = ach;
    return {
      ...baseAchievement,
      Icon: getIcon(icon),
    };
  });
};
export const fetchMyChats = async (): Promise<MyChatItem[]> => {
  const chats = await apiFetch<any[]>('/profile/chats');
  return chats.map((chat) => ({
    ...chat,
    icon: chat.icon ?? 'Users',
    timestamp: formatTimestamp(chat.timestamp),
  }));
};
export const createEventReview = (
  eventId: number,
  rating: number,
  text?: string,
): Promise<void> =>
  apiFetch(`/events/${eventId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ rating, ...(text?.trim() ? { text: text.trim() } : {}) }),
  });
export const fetchAllStories = async (): Promise<Story[]> => {
  const stories = await apiFetch<any[]>('/stories');
  return stories.map(mapStoryData);
};
export const fetchStoryById = async (id: number): Promise<Story> => {
  const story = await apiFetch<any>(`/stories/${id}`);
  return mapStoryData(story);
};
export const createStory = (
  eventId: number,
  text: string,
  imageUrl: string,
): Promise<Story> =>
  apiFetch('/stories', {
    method: 'POST',
    body: JSON.stringify({ eventId, text, imageUrl }),
  });
export const likeStory = (storyId: number): Promise<void> =>
  apiFetch(`/stories/${storyId}/like`, { method: 'POST' });
export const unlikeStory = (storyId: number): Promise<void> =>
  apiFetch(`/stories/${storyId}/like`, { method: 'DELETE' });
export const fetchRewards = (): Promise<RewardItem[]> => apiFetch('/rewards');
export const purchaseReward = (rewardId: number): Promise<void> =>
  apiFetch(`/rewards/${rewardId}/purchase`, {
    method: 'POST',
  });
export const fetchMapMarkers = (): Promise<MapMarker[]> =>
  apiFetch('/map-markers');
export const fetchFriends = (): Promise<Friend[]> => apiFetch('/friends');
export const fetchEventChatMessages = async (
  eventId: number,
): Promise<EventChatMessage[]> => {
  const messages = await apiFetch<any[]>(`/events/${eventId}/messages`);
  return messages.map((m) => ({
    ...m,
    timestamp: formatTimestamp(m.timestamp ?? m.createdAt),
  }));
};
export const postEventChatMessage = async (
  eventId: number,
  text: string,
): Promise<EventChatMessage> => {
  const m = await apiFetch<any>(`/events/${eventId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
  return { ...m, timestamp: formatTimestamp(m.timestamp ?? m.createdAt) };
};
export const fetchAssistantChatMessages = async (): Promise<ChatMessage[]> => {
  const messages = await apiFetch<any[]>('/assistant-chat/messages');
  return messages.map(mapAssistantMessage).reverse();
};
export const postAssistantMessage = async (text: string): Promise<ChatMessage> => {
  const message = await apiFetch<any>('/assistant-chat/messages', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
  return mapAssistantMessage(message);
};
export const fetchWeeklyChallenge = async (): Promise<WeeklyChallenge> => {
  const challenge = await apiFetch<
    Omit<WeeklyChallenge, 'Icon'> & { icon?: string | null }
  >('/challenge/weekly');
  return mapIcon(challenge);
};
