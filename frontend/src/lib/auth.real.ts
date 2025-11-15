import {createClient} from '@supabase/supabase-js';
import type {User} from './types';
import {Calendar, Clock, Dog, GraduationCap, HandHeart, Leaf, List, Palette, Star, Trophy, Users} from 'lucide-react';
import React from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL must be provided in environment variables");
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Map string icon names from API to actual React components
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
  'default': Star, // Fallback icon
};

const getIcon = (iconName: string): React.FC<any> => {
  return iconMap[iconName] || iconMap['default'];
};


const mapSupabaseUserToAppUser = (supabaseUser: any, backendProfile: any): User => {
  const stats = [
    {id: 'hours', value: String(backendProfile.totalHours || 0), label: 'часов добра', Icon: Clock},
    {id: 'karma', value: (backendProfile.karmaPoints || 0).toLocaleString('ru-RU'), label: 'баллов кармы', Icon: Star},
    {id: 'events', value: String(backendProfile.eventCount || 0), label: 'события', Icon: Calendar},
    {id: 'achievements', value: String(backendProfile.achievements?.length || 0), label: 'ачивок', Icon: Trophy},
  ];

  const achievements = (backendProfile.achievements || [])
    .slice(0, 5) // Profile page shows 5 recent achievements
    .map((userAchievement: any) => ({
      id: userAchievement.achievement.id,
      name: userAchievement.achievement.name,
      Icon: getIcon(userAchievement.achievement.icon || 'default'),
    }));

  return {
    firstName: backendProfile.firstName || 'Пользователь',
    lastName: backendProfile.lastName || '',
    avatarUrl: backendProfile.avatarUrl || `https://i.pravatar.cc/150?u=${supabaseUser.id}`,
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

export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const {data, error} = await supabase.auth.signInWithPassword({email, password});

  if (error || !data.session) {
    throw new Error(error?.message || 'Authentication failed');
  }

  const profileResponse = await fetch(`${API_BASE_URL}/profile/me`, {
    headers: {'Authorization': `Bearer ${data.session.access_token}`}
  });

  if (!profileResponse.ok) {
    await supabase.auth.signOut();
    throw new Error("User profile not found on our backend.");
  }

  const backendProfile = await profileResponse.json();

  return {
    user: mapSupabaseUserToAppUser(data.user, backendProfile),
    token: data.session.access_token,
  };
};

export const register = async (userData: {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}): Promise<{ user: User; token: string }> => {
  const {data, error} = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        name: `${userData.firstName} ${userData.lastName}`
      }
    }
  });

  if (error || !data.session) {
    throw new Error(error?.message || 'Registration failed');
  }

  await new Promise(resolve => setTimeout(resolve, 1500));

  const profileResponse = await fetch(`${process.env.VITE_API_BASE_URL}/profile/me`, {
    headers: {'Authorization': `Bearer ${data.session.access_token}`}
  });

  if (!profileResponse.ok) {
    await supabase.auth.signOut();
    throw new Error("Could not retrieve user profile after registration.");
  }

  const backendProfile = await profileResponse.json();

  return {
    user: mapSupabaseUserToAppUser(data.user, backendProfile),
    token: data.session.access_token,
  };
};

export const logout = async (): Promise<void> => {
  const {error} = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error.message);
  }
};

export const getCurrentSession = async (): Promise<{ user: User; token: string } | null> => {
  const {data, error} = await supabase.auth.getSession();

  if (error || !data.session) {
    return null;
  }

  try {
    const profileResponse = await fetch(`${process.env.VITE_API_BASE_URL}/profile/me`, {
      headers: {'Authorization': `Bearer ${data.session.access_token}`}
    });

    if (!profileResponse.ok) return null;

    const backendProfile = await profileResponse.json();

    return {
      user: mapSupabaseUserToAppUser(data.session.user, backendProfile),
      token: data.session.access_token
    };

  } catch (e) {
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
