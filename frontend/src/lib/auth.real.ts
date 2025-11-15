import { createClient } from '@supabase/supabase-js';
import type { User } from './types';
import {
  Calendar,
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
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL must be provided');
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

const getIcon = (iconName: string): React.FC<any> => {
  return iconMap[iconName] || iconMap['default'];
};

const mapBackendProfileToAppUser = (backendProfile: any): User => {
  const stats = (backendProfile.stats || []).map((stat: any) => ({
    ...stat,
    Icon: getIcon(stat.icon || 'default'),
  }));

  const achievements = (backendProfile.achievements || [])
    .slice(0, 5)
    .map((userAchievement: any) => ({
      id: userAchievement.achievement.id,
      name: userAchievement.achievement.name,
      Icon: getIcon(userAchievement.achievement.icon || 'default'),
    }));

  return {
    firstName: backendProfile.firstName || 'Пользователь',
    lastName: backendProfile.lastName || '',
    avatarUrl:
      backendProfile.avatarUrl || `https://i.pravatar.cc/150?u=${backendProfile.id}`,
    about: backendProfile.about || '',
    level: backendProfile.level || 'Новичок',
    progress: backendProfile.progress || 0,
    nextLevel: backendProfile.nextLevel || 'Активист',
    role: backendProfile.role || 'volunteer',
    organizationId: backendProfile.organizationId,
    stats: stats,
    achievements: achievements,
  };
};

export const login = async (
  email: string,
  password: string,
): Promise<{ user: User; token: string }> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    throw new Error(error?.message || 'Authentication failed');
  }

  // После логина через Supabase, наш JWT будет в cookies, но мы можем запросить профиль
  const profileResponse = await fetch(`${API_BASE_URL}/profile/me`, {
    headers: { Authorization: `Bearer ${data.session.access_token}` },
  });

  if (!profileResponse.ok) {
    await supabase.auth.signOut();
    throw new Error('User profile not found on our backend.');
  }

  const backendProfile = await profileResponse.json();

  return {
    user: mapBackendProfileToAppUser(backendProfile),
    token: data.session.access_token,
  };
};

export const register = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        name: `${userData.firstName} ${userData.lastName}`,
      },
    },
  });

  if (error || !data.session) {
    throw new Error(error?.message || 'Registration failed');
  }

  // Даем бэкенду время обработать вебхук
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const profileResponse = await fetch(`${API_BASE_URL}/profile/me`, {
    headers: { Authorization: `Bearer ${data.session.access_token}` },
  });

  if (!profileResponse.ok) {
    await supabase.auth.signOut();
    throw new Error('Could not retrieve user profile after registration.');
  }

  const backendProfile = await profileResponse.json();

  return {
    user: mapBackendProfileToAppUser(backendProfile),
    token: data.session.access_token,
  };
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('internal_jwt');
  localStorage.removeItem('onboardingComplete');
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error.message);
  }
};

export const getCurrentSession = async (): Promise<{
  user: User;
  token: string;
} | null> => {
  let token: string | null = localStorage.getItem('internal_jwt');

  if (!token) {
    const { data: { session } } = await supabase.auth.getSession();
    token = session?.access_token || null;
  }
  
  if (!token) {
    return null;
  }

  try {
    const profileResponse = await fetch(`${API_BASE_URL}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!profileResponse.ok) {
      // Если токен невалидный (неважно, наш или Supabase), чистим все
      await logout();
      return null;
    }

    const backendProfile = await profileResponse.json();

    return {
      user: mapBackendProfileToAppUser(backendProfile),
      token: token,
    };
  } catch (e) {
    console.error('Error during session check:', e);
    return null;
  }
};

const ONBOARDING_KEY = 'onboardingComplete';

export const isOnboardingComplete = (): boolean => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

export const setOnboardingComplete = (): void => {
  localStorage.setItem(ONBOARDING_KEY, 'true');
};