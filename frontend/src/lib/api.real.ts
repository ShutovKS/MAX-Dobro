import { supabase } from './auth.real';
import type {
  Achievement,
  AppEvent,
  ChatMessage,
  Comment,
  Course,
  CourseCompletionResult,
  LessonCompletionResult,
  EventCreatePayload,
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
import { getIconComponent } from './iconMap';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Единый резолвер иконок (тот же, что используют компоненты через iconMap).
const getIcon = (iconName?: string | null): React.FC<any> =>
  getIconComponent(iconName);

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

// Сохраняем строку icon (компоненты читают iconMap[item.icon]) И добавляем
// готовый компонент Icon. Раньше icon вырезался → иконки падали в заглушку.
const mapIcon = <T extends { icon?: string | null }>(
  item: T,
): T & { Icon: React.FC<any> } => {
  return {
    ...item,
    icon: item.icon ?? 'default',
    Icon: getIcon(item.icon),
  } as T & { Icon: React.FC<any> };
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
      quiz: (lesson.questions || []).map((q: any) => ({
        id: q.id.toString(),
        question: q.question,
        // Тип вопроса приходит готовым с сервера (isMultiple); раньше выводился
        // из isCorrect, который API не отдаёт → все вопросы были single.
        type: q.isMultiple ? 'multiple' : 'single',
        answers: q.answers,
      })),
    };
  });

  // Статусы уроков: пройденные — из серверного completedLessonIds; первый
  // непройденный — текущий; остальные — заблокированы. Фолбэк на статус курса,
  // если прогресс по урокам не пришёл.
  const completedLessonIds: number[] = courseData.completedLessonIds || [];
  if (completedLessonIds.length > 0 || courseStatus !== 'completed') {
    let currentSet = false;
    mappedProgram.forEach((l) => {
      if (completedLessonIds.includes(l.id)) {
        l.status = 'completed';
      } else if (!currentSet) {
        l.status = 'current';
        currentSet = true;
      } else {
        l.status = 'locked';
      }
    });
  } else {
    mappedProgram.forEach((l) => (l.status = 'completed'));
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
    completedLessonIds,
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
  // limit=100: бэкенд по умолчанию отдаёт 10 — лента/карта/поиск видели только
  // первые 10 событий. Пагинация/бесконечная прокрутка — отдельной задачей.
  const events = await apiFetch<any[]>('/events?limit=100');
  return events.map(mapEventData);
};

export const fetchEventById = async (
  id: number,
): Promise<AppEvent | HistoryEvent> => {
  const event = await apiFetch<any>(`/events/${id}`);
  return mapEventData(event);
};

export const createEvent = async (
  payload: EventCreatePayload,
): Promise<AppEvent> => {
  const event = await apiFetch<any>('/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapEventData(event);
};

export const updateEvent = async (
  id: number,
  payload: Partial<EventCreatePayload>,
): Promise<AppEvent> => {
  const event = await apiFetch<any>(`/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
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
): Promise<CourseCompletionResult> => {
  return await apiFetch(`/courses/${courseId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
};
export const markLessonComplete = async (
  courseId: number,
  lessonId: number,
): Promise<LessonCompletionResult> => {
  return await apiFetch(`/courses/${courseId}/lessons/${lessonId}/complete`, {
    method: 'POST',
  });
};

export const fetchAllOrganizations = (): Promise<Organization[]> =>
  apiFetch('/organizations?limit=100');
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
export const fetchOrganizationDashboardStats = async (): Promise<
  OrganizationStat[]
> => {
  const stats = await apiFetch<any[]>(`/organization/dashboard/stats`);
  const iconByStatId: { [key: string]: React.FC<any> } = {
    subscribers: Users,
    events_total: List,
    rating: Star,
    reviews: Trophy,
  };
  return stats.map((s) => ({ ...s, Icon: iconByStatId[s.id] ?? Star }));
};
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
  return achievements.map((ach) => ({
    ...ach,
    icon: ach.icon ?? 'Award',
    Icon: getIcon(ach.icon ?? 'Award'),
  }));
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
export const createStoryComment = async (
  storyId: number,
  text: string,
): Promise<Comment> => {
  const c = await apiFetch<any>(`/stories/${storyId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
  return { ...c, timestamp: formatTimestamp(c.timestamp ?? c.createdAt) };
};
export const likeStory = (storyId: number): Promise<void> =>
  apiFetch(`/stories/${storyId}/like`, { method: 'POST' });
export const unlikeStory = (storyId: number): Promise<void> =>
  apiFetch(`/stories/${storyId}/like`, { method: 'DELETE' });
const REWARD_IMAGE_FALLBACK = (id: number | string) =>
  `https://picsum.photos/seed/dobro-reward-${id}/300`;
const mapRewardData = (r: any): RewardItem => ({
  ...r,
  // Сиды/БД могут не содержать imageUrl (колонка nullable) — подставляем
  // плейсхолдер, иначе <img> с пустым src даёт битую картинку.
  imageUrl: r.imageUrl || REWARD_IMAGE_FALLBACK(r.id),
  isPurchased: r.isPurchased ?? false,
});
export const fetchRewards = async (): Promise<RewardItem[]> => {
  const rewards = await apiFetch<any[]>('/rewards');
  return rewards.map(mapRewardData);
};
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
  // Бэкенд отдаёт сообщения в порядке createdAt desc (новые сверху) — для
  // ленты чата разворачиваем в хронологический порядок (старые сверху),
  // как и в ассистент-чате.
  return messages
    .map((m) => ({
      ...m,
      timestamp: formatTimestamp(m.timestamp ?? m.createdAt),
    }))
    .reverse();
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
export const fetchWeeklyChallenge = async (): Promise<WeeklyChallenge | null> => {
  const challenge = await apiFetch<
    (Omit<WeeklyChallenge, 'Icon'> & { icon?: string | null }) | null
  >('/challenge/weekly');
  // Нет активного челленджа — возвращаем null (раньше mapIcon(null) падал).
  if (!challenge) return null;
  return mapIcon({ ...challenge, icon: challenge.icon ?? 'Target' });
};
