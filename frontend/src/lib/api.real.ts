// src/lib/api.real.ts

import { supabase } from './auth.real';
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
  pos: { top: '0', left: '0' },
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

const mapCourseDetailData = (courseData: any): Course => {
  const storageKey = `course_progress_${courseData.id}`;
  const completedLessonIds: Set<number> = new Set(
    JSON.parse(localStorage.getItem(storageKey) || '[]')
  );

  let firstIncompleteIndex = -1;

  const mappedProgram = (courseData.lessons || []).map((lesson: any, index: number) => {
    const isCompleted = completedLessonIds.has(lesson.id);

    if (!isCompleted && firstIncompleteIndex === -1) {
      firstIncompleteIndex = index;
    }

    const lessonType = (lesson.questions && lesson.questions.length > 0) ? 'test' : 'lesson';

    let lessonStatus: 'completed' | 'current' | 'locked';
    if (isCompleted) {
      lessonStatus = 'completed';
    } else if (index === firstIncompleteIndex) {
      lessonStatus = 'current';
    } else {
      lessonStatus = 'locked';
    }

    const mappedQuiz = (lesson.questions || []).map((q: any) => {
      const correctAnswers = q.answers
        .filter((a: any) => a.isCorrect)
        .map((a: any) => a.answer);

      return {
        id: q.id.toString(),
        question: q.question,
        type: correctAnswers.length > 1 ? 'multiple' : 'single',
        options: q.answers.map((a: any) => a.answer),
        correctAnswer: correctAnswers.length === 1 ? correctAnswers[0] : undefined,
        correctAnswers: correctAnswers.length > 1 ? correctAnswers : undefined,
        answerIds: Object.fromEntries(
          q.answers.map((a: any) => [a.answer, a.id])
        ),
      };
    });

    return {
      id: lesson.id,
      title: lesson.title,
      type: (lesson.questions && lesson.questions.length > 0) ? 'test' : 'lesson',
      status: lessonStatus,
      contentTitle: lesson.title,
      content: lesson.content,
      quiz: (lesson.questions || []).map((q: any) => ({
        id: q.id.toString(),
        question: q.question,
        type: 'single',
        options: q.answers.map((a: any) => a.answer),
        answerIds: Object.fromEntries(q.answers.map((a: any) => [a.answer, a.id])),
      })),
    };
  });
  
  if (courseStatus === 'in-progress' && mappedProgram.length > 0) {
    const firstIncomplete = mappedProgram.find(l => l.status !== 'completed');
    if (firstIncomplete) {
      firstIncomplete.status = 'current';
    }
  }

  const totalLessons = mappedProgram.length;
  const progress = totalLessons > 0 ? (completedLessonIds.size / totalLessons) * 100 : 0;

  let courseStatus: 'not-started' | 'in-progress' | 'completed' = 'not-started';
  if (progress === 100) {
    courseStatus = 'completed';
  } else if (progress > 0) {
    courseStatus = 'in-progress';
  }

  return {
    ...mapIcon(courseData),
    id: courseData.id,
    title: courseData.title,
    description: courseData.description,
    duration: courseData.duration || "N/A",
    hasCertificate: courseData.hasCertificate || false,
    category: courseData.category || "General",
    status: courseStatus,
    progress: progress,
    level: courseData.level || 'Для новичков',
    program: mappedProgram,
  };
};

const mapCourseSummaryData = (courseData: any): Course => {
  const storageKey = `course_progress_${courseData.id}`;
  const completedLessonIds: number[] = JSON.parse(localStorage.getItem(storageKey) || '[]');

  const totalLessons = courseData._count?.lessons ?? 0;
  const progress = totalLessons > 0 ? (completedLessonIds.length / totalLessons) * 100 : 0;

  let courseStatus: 'not-started' | 'in-progress' | 'completed' = 'not-started';
  if (progress === 100) {
    courseStatus = 'completed';
  } else if (progress > 0) {
    courseStatus = 'in-progress';
  }

  return {
    ...mapIcon(courseData),
    id: courseData.id,
    title: courseData.title,
    description: courseData.description,
    duration: courseData.duration || "N/A",
    hasCertificate: courseData.hasCertificate || false,
    category: courseData.category || "General",
    status: courseStatus,
    progress: progress,
    level: courseData.level || 'Для новичков',
  };
};

export const fetchAllCourses = async (): Promise<Course[]> => {
  const coursesData = await apiFetch<any[]>('/courses');
  return coursesData.map(mapCourseSummaryData);
};

export const fetchCourseById = async (id: number): Promise<Course> => {
  const rawCourseData = await apiFetch<any>(`/courses/${id}`);
  return mapCourseDetailData(rawCourseData);
};

export const fetchAllOrganizations = (): Promise<Organization[]> => apiFetch('/organizations');
export const fetchOrganizationById = (id: number): Promise<Organization> => apiFetch(`/organizations/${id}`);

export const updateOrganizationSubscription = (organizationId: number, isSubscribed: boolean): Promise<void> => {
  return apiFetch(`/organizations/${organizationId}/subscription`, {
    method: 'POST',
    body: JSON.stringify({ isSubscribed }),
  });
};

export const fetchOrganizationEvents = (): Promise<OrganizationEvent[]> => apiFetch(`/organization/events`);
export const fetchEventParticipants = (eventId: number): Promise<EventParticipant[]> => apiFetch(`/organization/events/${eventId}/participants`);

export const fetchOrganizationDashboardStats = (): Promise<OrganizationStat[]> => apiFetch(`/organization/dashboard/stats`);
export const fetchOrganizationDetails = (): Promise<OrganizationDetails> => apiFetch(`/organization/details`);

export const fetchActivityHistoryEvents = async (): Promise<HistoryEvent[]> => {
  const data = await apiFetch<{ upcoming: any[], past: any[] }>( '/profile/me/events');
  const upcoming = data.upcoming.map(event => ({...mapEventData(event), status: 'upcoming' as const}));
  const past = data.past.map(event => ({...mapEventData(event), status: 'past' as const}));
  return [...upcoming, ...past];
};

export const fetchLeaderboardData = (
  period: 'week' | 'month' | 'allTime',
): Promise<{ topUsers: LeaderboardUser[]; currentUser: LeaderboardUser | null }> => apiFetch(`/leaderboard?period=${period}`);

export const fetchAllAchievements = async (): Promise<Achievement[]> => {
  const achievements = await apiFetch<(Omit<Achievement, 'Icon'> & { icon?: string | null })[]>( '/achievements');
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
  return chats.map(chat => ({ ...chat, Icon: getIconForCategory(chat.category) }));
};

export const fetchAllStories = (): Promise<Story[]> => apiFetch('/stories');
export const fetchStoryById = (id: number): Promise<Story> => apiFetch(`/stories/${id}`);
export const fetchRewards = (): Promise<RewardItem[]> => apiFetch('/rewards');
export const fetchMapMarkers = (): Promise<MapMarker[]> => apiFetch('/map-markers');
export const fetchFriends = (): Promise<Friend[]> => apiFetch('/friends');
export const fetchEventChatMessages = (eventId: number): Promise<EventChatMessage[]> => apiFetch(`/events/${eventId}/messages`);

export const fetchWeeklyChallenge = async (): Promise<WeeklyChallenge> => {
  const challenge = await apiFetch<Omit<WeeklyChallenge, 'Icon'> & { icon?: string | null }>( '/challenge/weekly');
  return mapIcon(challenge);
};

export const completeCourse = async (
  courseId: number,
  answers: { questionId: number; answerId: number }[],
): Promise<void> => {
  await apiFetch(`/courses/${courseId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
};
