// FILE: frontend/src/lib/api.real.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Call the NestJS API and map HTTP payloads onto mini-app domain types.
//   SCOPE: Authenticated fetch, event/course/org/story/reward/chat adapters
//   DEPENDS: M-FRONTEND-AUTH M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-API V-M-FRONTEND-API M-FRONTEND-AUTH M-FRONTEND-TYPES
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   fetchAllEvents - event catalog
//   participateInEvent - join an event
//   completeCourse - submit course quiz answers
//   purchaseReward - spend karma on a reward
//   apiFetch - authenticated JSON fetch helper
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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

// START_BLOCK_API_FETCH
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
// END_BLOCK_API_FETCH

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
  // START_BLOCK_MAP_COURSE_DATA
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
  // END_BLOCK_MAP_COURSE_DATA
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

// START_BLOCK_FETCH_EVENTS
// START_CONTRACT: fetchAllEvents
//   PURPOSE: Load the volunteer event catalog
//   INPUTS: { none }
//   OUTPUTS: { Promise<AppEvent[]> - mapped events }
//   SIDE_EFFECTS: GET /events?limit=100
//   LINKS: M-FRONTEND-API export-fetchAllEvents
// END_CONTRACT: fetchAllEvents
export const fetchAllEvents = async (): Promise<AppEvent[]> => {
  // limit=100: бэкенд по умолчанию отдаёт 10 — лента/карта/поиск видели только
  // первые 10 событий. Пагинация/бесконечная прокрутка — отдельной задачей.
  const events = await apiFetch<any[]>('/events?limit=100');
  return events.map(mapEventData);
};

// START_CONTRACT: fetchEventById
//   PURPOSE: Load one event by id
//   INPUTS: { id: number - event id }
//   OUTPUTS: { Promise<AppEvent | HistoryEvent> - mapped event }
//   SIDE_EFFECTS: GET /events/:id
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchEventById
export const fetchEventById = async (
  id: number,
): Promise<AppEvent | HistoryEvent> => {
  const event = await apiFetch<any>(`/events/${id}`);
  return mapEventData(event);
};

// START_CONTRACT: createEvent
//   PURPOSE: Create an organizer event
//   INPUTS: { payload: EventCreatePayload }
//   OUTPUTS: { Promise<AppEvent> - mapped created event }
//   SIDE_EFFECTS: POST /events
//   LINKS: M-FRONTEND-API
// END_CONTRACT: createEvent
export const createEvent = async (
  payload: EventCreatePayload,
): Promise<AppEvent> => {
  const event = await apiFetch<any>('/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapEventData(event);
};

// START_CONTRACT: updateEvent
//   PURPOSE: Patch an organizer event
//   INPUTS: { id: number; payload: Partial<EventCreatePayload> }
//   OUTPUTS: { Promise<AppEvent> - mapped updated event }
//   SIDE_EFFECTS: PATCH /events/:id
//   LINKS: M-FRONTEND-API
// END_CONTRACT: updateEvent
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

// START_CONTRACT: participateInEvent
//   PURPOSE: Join an event as the current user
//   INPUTS: { eventId: number }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: POST /events/:id/participate
//   LINKS: M-FRONTEND-API export-participateInEvent
// END_CONTRACT: participateInEvent
export const participateInEvent = (eventId: number): Promise<void> =>
  apiFetch(`/events/${eventId}/participate`, {
    method: 'POST',
  });

// START_CONTRACT: cancelEventParticipation
//   PURPOSE: Leave an event as the current user
//   INPUTS: { eventId: number }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: DELETE /events/:id/participate
//   LINKS: M-FRONTEND-API
// END_CONTRACT: cancelEventParticipation
export const cancelEventParticipation = (eventId: number): Promise<void> =>
  apiFetch(`/events/${eventId}/participate`, {
    method: 'DELETE',
  });
// END_BLOCK_FETCH_EVENTS

// START_BLOCK_FETCH_COURSES
// START_CONTRACT: fetchAllCourses
//   PURPOSE: Load courses for the current user
//   INPUTS: { none }
//   OUTPUTS: { Promise<Course[]> - mapped courses }
//   SIDE_EFFECTS: GET /profile/me/courses
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchAllCourses
export const fetchAllCourses = async (): Promise<Course[]> => {
  const coursesData = await apiFetch<any[]>('/profile/me/courses');
  return coursesData.map(mapCourseData);
};

// START_CONTRACT: fetchCourseById
//   PURPOSE: Find one of the current user's courses by id
//   INPUTS: { id: number }
//   OUTPUTS: { Promise<Course | undefined> }
//   SIDE_EFFECTS: GET /profile/me/courses via fetchAllCourses
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchCourseById
export const fetchCourseById = async (
  id: number,
): Promise<Course | undefined> => {
  const allUserCourses = await fetchAllCourses();
  return allUserCourses.find((c) => c.id === id);
};

// START_CONTRACT: completeCourse
//   PURPOSE: Submit quiz answers and receive a pass/fail result
//   INPUTS: { courseId: number; answers: { questionId, answerId }[] }
//   OUTPUTS: { Promise<CourseCompletionResult> }
//   SIDE_EFFECTS: POST /courses/:id/complete
//   LINKS: M-FRONTEND-API export-completeCourse
// END_CONTRACT: completeCourse
export const completeCourse = async (
  courseId: number,
  answers: { questionId: number; answerId: number }[],
): Promise<CourseCompletionResult> => {
  return await apiFetch(`/courses/${courseId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
};
// START_CONTRACT: markLessonComplete
//   PURPOSE: Mark a course lesson complete on the server
//   INPUTS: { courseId: number; lessonId: number }
//   OUTPUTS: { Promise<LessonCompletionResult> }
//   SIDE_EFFECTS: POST /courses/:id/lessons/:lessonId/complete
//   LINKS: M-FRONTEND-API
// END_CONTRACT: markLessonComplete
export const markLessonComplete = async (
  courseId: number,
  lessonId: number,
): Promise<LessonCompletionResult> => {
  return await apiFetch(`/courses/${courseId}/lessons/${lessonId}/complete`, {
    method: 'POST',
  });
};
// END_BLOCK_FETCH_COURSES

// START_BLOCK_FETCH_ORGANIZATIONS
// START_CONTRACT: fetchAllOrganizations
//   PURPOSE: Load the organization catalog
//   INPUTS: { none }
//   OUTPUTS: { Promise<Organization[]> }
//   SIDE_EFFECTS: GET /organizations?limit=100
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchAllOrganizations
export const fetchAllOrganizations = (): Promise<Organization[]> =>
  apiFetch('/organizations?limit=100');
// START_CONTRACT: fetchOrganizationById
//   PURPOSE: Load one organization by id
//   INPUTS: { id: number }
//   OUTPUTS: { Promise<Organization> }
//   SIDE_EFFECTS: GET /organizations/:id
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchOrganizationById
export const fetchOrganizationById = (id: number): Promise<Organization> =>
  apiFetch(`/organizations/${id}`);
// START_CONTRACT: updateOrganizationSubscription
//   PURPOSE: Subscribe or unsubscribe from an organization
//   INPUTS: { organizationId: number; isSubscribed: boolean }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: POST /organizations/:id/subscription
//   LINKS: M-FRONTEND-API
// END_CONTRACT: updateOrganizationSubscription
export const updateOrganizationSubscription = (
  organizationId: number,
  isSubscribed: boolean,
): Promise<void> => {
  return apiFetch(`/organizations/${organizationId}/subscription`, {
    method: 'POST',
    body: JSON.stringify({ isSubscribed }),
  });
};
// START_CONTRACT: fetchOrganizationEvents
//   PURPOSE: Load events owned by the current organizer
//   INPUTS: { none }
//   OUTPUTS: { Promise<OrganizationEvent[]> }
//   SIDE_EFFECTS: GET /organization/events
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchOrganizationEvents
export const fetchOrganizationEvents = (): Promise<OrganizationEvent[]> =>
  apiFetch(`/organization/events`);
// START_CONTRACT: fetchEventParticipants
//   PURPOSE: Load participants for an organizer-owned event
//   INPUTS: { eventId: number }
//   OUTPUTS: { Promise<EventParticipant[]> }
//   SIDE_EFFECTS: GET /organization/events/:id/participants
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchEventParticipants
export const fetchEventParticipants = (
  eventId: number,
): Promise<EventParticipant[]> =>
  apiFetch(`/organization/events/${eventId}/participants`);
// START_CONTRACT: fetchOrganizationDashboardStats
//   PURPOSE: Load organizer dashboard stats with icon components
//   INPUTS: { none }
//   OUTPUTS: { Promise<OrganizationStat[]> }
//   SIDE_EFFECTS: GET /organization/dashboard/stats
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchOrganizationDashboardStats
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
// START_CONTRACT: fetchOrganizationDetails
//   PURPOSE: Load the current organizer organization record
//   INPUTS: { none }
//   OUTPUTS: { Promise<OrganizationDetails> }
//   SIDE_EFFECTS: GET /organization/details
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchOrganizationDetails
export const fetchOrganizationDetails = (): Promise<OrganizationDetails> =>
  apiFetch(`/organization/details`);
// END_BLOCK_FETCH_ORGANIZATIONS

// START_BLOCK_FETCH_PROFILE
// START_CONTRACT: fetchActivityHistoryEvents
//   PURPOSE: Load the current user's event history
//   INPUTS: { none }
//   OUTPUTS: { Promise<HistoryEvent[]> }
//   SIDE_EFFECTS: GET /profile/me/events
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchActivityHistoryEvents
export const fetchActivityHistoryEvents = async (): Promise<HistoryEvent[]> => {
  const data = await apiFetch<any[]>('/profile/me/events');
  return data.map((event) => ({
    ...mapEventData(event),
    status: new Date(event.date) < new Date() ? 'past' : 'upcoming',
  }));
};
// START_CONTRACT: fetchLeaderboardData
//   PURPOSE: Load leaderboard rows for a period
//   INPUTS: { period: 'week' | 'month' | 'allTime' }
//   OUTPUTS: { Promise<{ topUsers, currentUser }> }
//   SIDE_EFFECTS: GET /leaderboard
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchLeaderboardData
export const fetchLeaderboardData = (
  period: 'week' | 'month' | 'allTime',
): Promise<{ topUsers: LeaderboardUser[]; currentUser: LeaderboardUser | null }> =>
  apiFetch(`/leaderboard?period=${period}`);
// START_CONTRACT: updateProfile
//   PURPOSE: Patch the current user's profile fields
//   INPUTS: { data: { firstName?, lastName?, about?, avatarUrl? } }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: PATCH /profile/me
//   LINKS: M-FRONTEND-API
// END_CONTRACT: updateProfile
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
// START_CONTRACT: fetchAllAchievements
//   PURPOSE: Load the global achievement catalog
//   INPUTS: { none }
//   OUTPUTS: { Promise<Achievement[]> }
//   SIDE_EFFECTS: GET /achievements
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchAllAchievements
export const fetchAllAchievements = async (): Promise<Achievement[]> => {
  const achievements = await apiFetch<
    (Omit<Achievement, 'Icon'> & { icon?: string | null })[]
  >('/achievements');
  return achievements.map(mapIcon);
};
// START_CONTRACT: fetchUserAchievements
//   PURPOSE: Load achievements unlocked by the current user
//   INPUTS: { none }
//   OUTPUTS: { Promise<Achievement[]> }
//   SIDE_EFFECTS: GET /profile/me/achievements
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchUserAchievements
export const fetchUserAchievements = async (): Promise<Achievement[]> => {
  const achievements = await apiFetch<any[]>('/profile/me/achievements');
  return achievements.map((ach) => ({
    ...ach,
    icon: ach.icon ?? 'Award',
    Icon: getIcon(ach.icon ?? 'Award'),
  }));
};
// START_CONTRACT: fetchMyChats
//   PURPOSE: Load the current user's event chat list
//   INPUTS: { none }
//   OUTPUTS: { Promise<MyChatItem[]> }
//   SIDE_EFFECTS: GET /profile/chats
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchMyChats
export const fetchMyChats = async (): Promise<MyChatItem[]> => {
  const chats = await apiFetch<any[]>('/profile/chats');
  return chats.map((chat) => ({
    ...chat,
    icon: chat.icon ?? 'Users',
    timestamp: formatTimestamp(chat.timestamp),
  }));
};
// START_CONTRACT: createEventReview
//   PURPOSE: Submit a rating and optional review text for an event
//   INPUTS: { eventId: number; rating: number; text?: string }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: POST /events/:id/reviews
//   LINKS: M-FRONTEND-API
// END_CONTRACT: createEventReview
export const createEventReview = (
  eventId: number,
  rating: number,
  text?: string,
): Promise<void> =>
  apiFetch(`/events/${eventId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ rating, ...(text?.trim() ? { text: text.trim() } : {}) }),
  });
// END_BLOCK_FETCH_PROFILE

// START_BLOCK_FETCH_STORIES
// START_CONTRACT: fetchAllStories
//   PURPOSE: Load the stories feed
//   INPUTS: { none }
//   OUTPUTS: { Promise<Story[]> }
//   SIDE_EFFECTS: GET /stories
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchAllStories
export const fetchAllStories = async (): Promise<Story[]> => {
  const stories = await apiFetch<any[]>('/stories');
  return stories.map(mapStoryData);
};
// START_CONTRACT: fetchStoryById
//   PURPOSE: Load one story by id
//   INPUTS: { id: number }
//   OUTPUTS: { Promise<Story> }
//   SIDE_EFFECTS: GET /stories/:id
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchStoryById
export const fetchStoryById = async (id: number): Promise<Story> => {
  const story = await apiFetch<any>(`/stories/${id}`);
  return mapStoryData(story);
};
// START_CONTRACT: createStory
//   PURPOSE: Publish a story for an event
//   INPUTS: { eventId: number; text: string; imageUrl: string }
//   OUTPUTS: { Promise<Story> }
//   SIDE_EFFECTS: POST /stories
//   LINKS: M-FRONTEND-API
// END_CONTRACT: createStory
export const createStory = (
  eventId: number,
  text: string,
  imageUrl: string,
): Promise<Story> =>
  apiFetch('/stories', {
    method: 'POST',
    body: JSON.stringify({ eventId, text, imageUrl }),
  });
// START_CONTRACT: createStoryComment
//   PURPOSE: Add a comment to a story
//   INPUTS: { storyId: number; text: string }
//   OUTPUTS: { Promise<Comment> }
//   SIDE_EFFECTS: POST /stories/:id/comments
//   LINKS: M-FRONTEND-API
// END_CONTRACT: createStoryComment
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
// START_CONTRACT: likeStory
//   PURPOSE: Like a story
//   INPUTS: { storyId: number }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: POST /stories/:id/like
//   LINKS: M-FRONTEND-API
// END_CONTRACT: likeStory
export const likeStory = (storyId: number): Promise<void> =>
  apiFetch(`/stories/${storyId}/like`, { method: 'POST' });
// START_CONTRACT: unlikeStory
//   PURPOSE: Remove a like from a story
//   INPUTS: { storyId: number }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: DELETE /stories/:id/like
//   LINKS: M-FRONTEND-API
// END_CONTRACT: unlikeStory
export const unlikeStory = (storyId: number): Promise<void> =>
  apiFetch(`/stories/${storyId}/like`, { method: 'DELETE' });
// END_BLOCK_FETCH_STORIES

// START_BLOCK_FETCH_REWARDS
const REWARD_IMAGE_FALLBACK = (id: number | string) =>
  `https://picsum.photos/seed/dobro-reward-${id}/300`;
const mapRewardData = (r: any): RewardItem => ({
  ...r,
  // Сиды/БД могут не содержать imageUrl (колонка nullable) — подставляем
  // плейсхолдер, иначе <img> с пустым src даёт битую картинку.
  imageUrl: r.imageUrl || REWARD_IMAGE_FALLBACK(r.id),
  isPurchased: r.isPurchased ?? false,
});
// START_CONTRACT: fetchRewards
//   PURPOSE: Load karma store items
//   INPUTS: { none }
//   OUTPUTS: { Promise<RewardItem[]> }
//   SIDE_EFFECTS: GET /rewards
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchRewards
export const fetchRewards = async (): Promise<RewardItem[]> => {
  const rewards = await apiFetch<any[]>('/rewards');
  return rewards.map(mapRewardData);
};
// START_CONTRACT: purchaseReward
//   PURPOSE: Spend karma to purchase a reward
//   INPUTS: { rewardId: number }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: POST /rewards/:id/purchase
//   LINKS: M-FRONTEND-API export-purchaseReward
// END_CONTRACT: purchaseReward
export const purchaseReward = (rewardId: number): Promise<void> =>
  apiFetch(`/rewards/${rewardId}/purchase`, {
    method: 'POST',
  });
// START_CONTRACT: fetchMapMarkers
//   PURPOSE: Load map markers for the event map
//   INPUTS: { none }
//   OUTPUTS: { Promise<MapMarker[]> }
//   SIDE_EFFECTS: GET /map-markers
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchMapMarkers
export const fetchMapMarkers = (): Promise<MapMarker[]> =>
  apiFetch('/map-markers');
// START_CONTRACT: fetchFriends
//   PURPOSE: Load the current user's friends
//   INPUTS: { none }
//   OUTPUTS: { Promise<Friend[]> }
//   SIDE_EFFECTS: GET /friends
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchFriends
export const fetchFriends = (): Promise<Friend[]> => apiFetch('/friends');
// END_BLOCK_FETCH_REWARDS

// START_BLOCK_FETCH_CHATS
// START_CONTRACT: fetchEventChatMessages
//   PURPOSE: Load event chat messages in chronological order
//   INPUTS: { eventId: number }
//   OUTPUTS: { Promise<EventChatMessage[]> }
//   SIDE_EFFECTS: GET /events/:id/messages
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchEventChatMessages
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
// START_CONTRACT: postEventChatMessage
//   PURPOSE: Send a message in an event chat
//   INPUTS: { eventId: number; text: string }
//   OUTPUTS: { Promise<EventChatMessage> }
//   SIDE_EFFECTS: POST /events/:id/messages
//   LINKS: M-FRONTEND-API
// END_CONTRACT: postEventChatMessage
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
// START_CONTRACT: fetchAssistantChatMessages
//   PURPOSE: Load assistant chat history in chronological order
//   INPUTS: { none }
//   OUTPUTS: { Promise<ChatMessage[]> }
//   SIDE_EFFECTS: GET /assistant-chat/messages
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchAssistantChatMessages
export const fetchAssistantChatMessages = async (): Promise<ChatMessage[]> => {
  const messages = await apiFetch<any[]>('/assistant-chat/messages');
  return messages.map(mapAssistantMessage).reverse();
};
// START_CONTRACT: postAssistantMessage
//   PURPOSE: Send a user message to the assistant
//   INPUTS: { text: string }
//   OUTPUTS: { Promise<ChatMessage> - mapped assistant reply }
//   SIDE_EFFECTS: POST /assistant-chat/messages
//   LINKS: M-FRONTEND-API
// END_CONTRACT: postAssistantMessage
export const postAssistantMessage = async (text: string): Promise<ChatMessage> => {
  const message = await apiFetch<any>('/assistant-chat/messages', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
  return mapAssistantMessage(message);
};
// START_CONTRACT: fetchWeeklyChallenge
//   PURPOSE: Load the active weekly challenge or null
//   INPUTS: { none }
//   OUTPUTS: { Promise<WeeklyChallenge | null> }
//   SIDE_EFFECTS: GET /challenge/weekly
//   LINKS: M-FRONTEND-API
// END_CONTRACT: fetchWeeklyChallenge
export const fetchWeeklyChallenge = async (): Promise<WeeklyChallenge | null> => {
  const challenge = await apiFetch<
    (Omit<WeeklyChallenge, 'Icon'> & { icon?: string | null }) | null
  >('/challenge/weekly');
  // Нет активного челленджа — возвращаем null (раньше mapIcon(null) падал).
  if (!challenge) return null;
  return mapIcon({ ...challenge, icon: challenge.icon ?? 'Target' });
};
// END_BLOCK_FETCH_CHATS
