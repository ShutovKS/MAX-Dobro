// FILE: frontend/src/lib/types.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Share TypeScript models used by screens and API adapters.
//   SCOPE: Event, course, organization, user, story, chat, reward, and filter types
//   DEPENDS: none
//   LINKS: M-FRONTEND-TYPES V-M-FRONTEND-TYPES
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   AppEvent - volunteer event card model
//   Course - training course with lessons and quizzes
//   Organization - catalog organization
//   User - volunteer or organizer session profile
//   Story - feed story with comments
//   RewardItem - karma store item
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly VITE_API_MODE: 'real' | 'mock';
      readonly VITE_API_BASE_URL: string;
      readonly VITE_SUPABASE_URL: string;
      readonly VITE_SUPABASE_ANON_KEY: string;
    }
  }
}

import React from 'react';

// START_BLOCK_DOMAIN_TYPES
// START_BLOCK_EVENT_TYPES
export type AppEvent = {
  id: number;
  organizationId: number;
  organizationName: string;
  title: string;
  category: string;
  date: string;
  location: string;
  icon: string;
  imageUrl?: string;
  pos: { top: string; left: string };
  requirements?: string[];
  participantCount?: number;
  rewards?: { hours: number; karma: number };
  isParticipating?: boolean;
  participationStatus?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type HistoryEvent = AppEvent & {
  status: 'upcoming' | 'past';
  role?: string;
};

export type FilterFormat = 'Все' | 'Офлайн' | 'Онлайн';
export type FilterDate = 'Любая' | 'Сегодня' | 'На неделе';

export interface Filters {
  format: FilterFormat;
  categories: string[];
  date: FilterDate;
  distance: number;
}

export type EventCreatePayload = {
  title: string;
  description: string;
  date: string; // ISO
  location?: string;
  maxParticipants?: number;
  category?: string;
  requirements?: string;
  latitude?: number;
  longitude?: number;
  durationHours?: number;
  karmaPoints?: number;
  recommendedCourseId?: number;
};
// END_BLOCK_EVENT_TYPES

// START_BLOCK_COURSE_TYPES
export type QuizAnswer = {
  id: number;
  answer: string;
  // Сервер не отдаёт isCorrect до отправки теста (правильность приходит в
  // ответе completeCourse). В мок-данных поле присутствует.
  isCorrect?: boolean;
};

export type QuizQuestion = {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  answers: QuizAnswer[];
};

export type CourseLesson = {
  id: number;
  title: string;
  type: 'lesson' | 'test';
  status: 'completed' | 'current' | 'locked';
  contentTitle?: string;
  content?: string;
  quiz?: QuizQuestion[];
};

export type Course = {
  id: number;
  title: string;
  description: string;
  duration: string;
  hasCertificate: boolean;
  category: string;
  icon: string;
  status: 'completed' | 'in-progress' | 'not-started';
  progress: number;
  level: 'Для новичков' | 'Средний' | 'Продвинутый';
  program?: CourseLesson[];
  completedLessonIds?: number[];
};

export type CourseCompletionResult = {
  isPassed: boolean;
  score: number;
  totalQuestions: number;
  correctAnswers: Record<string, number[]>;
};

export type LessonCompletionResult = {
  completedLessonIds: number[];
  totalLessons: number;
  courseCompleted: boolean;
};
// END_BLOCK_COURSE_TYPES

export type Tab = 'home' | 'training' | 'organizations' | 'stories' | 'profile';
export type ProfileSubScreen =
  | 'activityHistory'
  | 'allAchievements'
  | 'calendar'
  | 'leaderboards'
  | 'settings'
  | 'editProfile'
  | 'myCertificates'
  | 'myChats'
  | 'rewardsStore';

// START_BLOCK_ORG_TYPES
export interface OrganizationFilters {
  city: string;
  categories: string[];
  verifiedOnly: boolean;
}

export type Organization = {
  id: number;
  name: string;
  description: string;
  category: string;
  logoUrl: string;
  isVerified: boolean;
  coverImageUrl: string;
  rating: number;
  reviewCount: number;
  subscribers: number;
  websiteUrl: string;
  fullDescription: string;
  isSubscribed: boolean;
  address: string;
};

export type OrganizationStat = {
  id: string;
  label: string;
  value: string;
  Icon: React.FC<any>;
  change: string;
};

export type OrganizationDetails = {
  id: number;
  name: string;
};

export type OrganizationEvent = {
  id: number;
  title: string;
  date: string;
  status: 'active' | 'past' | 'draft';
  participantCount: number;
  capacity: number;
  newApplications: number;
};

export type EventParticipant = {
  id: number;
  name: string;
  avatarUrl: string;
  rating: number;
  status: 'new' | 'confirmed' | 'rejected';
};
// END_BLOCK_ORG_TYPES

// START_BLOCK_USER_TYPES
export type Achievement = {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  target?: number;
  cta?: string;
  filterCategory?: string;
};

export type LeaderboardUser = {
  id: number;
  name: string;
  avatarUrl: string;
  karma: number;
  rank: number;
};

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  about: string;
  level: string;
  progress: number;
  nextLevel: string;
  role: 'volunteer' | 'organization';
  organizationId?: number;
  stats: {
    id: string;
    value: string;
    label: string;
    icon: string;
  }[];
  achievements: {
    id: number;
    name: string;
    icon: string;
  }[];
};

export type Friend = {
  id: number;
  name: string;
  avatarUrl: string;
};
// END_BLOCK_USER_TYPES

// START_BLOCK_STORY_TYPES
export type Comment = {
  id: number;
  author: {
    name: string;
    avatarUrl: string;
  };
  timestamp: string;
  text: string;
};

export type Story = {
  id: number;
  author: {
    name: string;
    avatarUrl: string;
  };
  timestamp: string;
  event: {
    id: number;
    name: string;
  };
  text: string;
  imageUrl: string;
  likes: number;
  comments: number;
  commentsData: Comment[];
  isLiked?: boolean;
};
// END_BLOCK_STORY_TYPES

// START_BLOCK_CHAT_TYPES
export type ChatMessage = {
  id: number;
  sender: 'user' | 'assistant';
  type: 'text' | 'event-card' | 'course-card' | 'suggestion-chips' | 'loading';
  text?: string;
  event?: AppEvent;
  course?: Course;
  suggestions?: string[];
  actions?: { label: string; route: string }[];
  variant?: 'default' | 'tip' | 'system';
  timestamp?: string;
};

export type EventChatMessage = {
  id: number;
  author: {
    id: number;
    name: string;
    avatarUrl: string;
  };
  text: string;
  timestamp: string;
};

export type MyChatItem = {
  id: number;
  eventId: number;
  eventTitle: string;
  icon: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isArchived: boolean;
};

export type RewardItem = {
  id: number;
  name: string;
  category: 'Значки' | 'Темы оформления';
  price: number;
  imageUrl: string;
  isPurchased: boolean;
};

export type MapMarker = {
  id: number;
  position: [number, number];
  title: string;
  description: string;
};

export type WeeklyChallenge = {
  title: string;
  description: string;
  reward: string;
  icon: string;
  progress: number;
  target: number;
  filterCategory: string;
  isCompleted: boolean;
};
// END_BLOCK_CHAT_TYPES
// END_BLOCK_DOMAIN_TYPES
