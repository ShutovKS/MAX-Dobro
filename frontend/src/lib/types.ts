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

export type AppEvent = {
  id: number;
  organizationId: number;
  organizationName: string;
  title: string;
  category: string;
  date: string;
  location: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  pos: { top: string; left: string; };
  requirements?: string[];
  participantCount?: number;
  rewards?: { hours: number; karma: number };
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

export type QuizQuestion = {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
}
export type CourseLesson = {
  title: string;
  type: 'lesson' | 'test';
  status: 'completed' | 'current' | 'locked';
  contentTitle?: string;
  content?: string;
  quiz?: QuizQuestion[];
}

export type Course = {
  id: number;
  title: string;
  description: string;
  duration: string;
  hasCertificate: boolean;
  category: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  status: 'completed' | 'in-progress' | 'not-started';
  progress: number;
  level: 'Для новичков' | 'Средний' | 'Продвинутый';
  program: CourseLesson[];
};

export type Tab = 'home' | 'training' | 'organizations' | 'stories' | 'profile';
export type ProfileSubScreen =
  'activityHistory'
  | 'allAchievements'
  | 'calendar'
  | 'leaderboards'
  | 'settings'
  | 'editProfile'
  | 'myCertificates'
  | 'myChats'
  | 'rewardsStore';

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

export type Achievement = {
  id: number;
  name: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
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
  firstName: string;
  lastName: string;
  avatarUrl: string;
  about: string;
  level: string;
  progress: number;
  nextLevel: string;
  role: 'volunteer' | 'organization';
  organizationId?: number;
  stats: { id: string; value: string; label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>>; }[];
  achievements: { id: number; name: string; Icon: React.FC<React.SVGProps<SVGSVGElement>>; }[];
}

export type Friend = {
  id: number;
  name: string;
  avatarUrl: string;
};

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
};

export type ChatMessage = {
  id: number;
  sender: 'user' | 'assistant';
  type: 'text' | 'event-card' | 'suggestion-chips' | 'loading';
  text?: string;
  event?: AppEvent;
  suggestions?: string[];
  actions?: { label: string; route: string; }[];
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
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
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
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  progress: number;
  target: number;
  filterCategory: string;
  isCompleted: boolean;
};