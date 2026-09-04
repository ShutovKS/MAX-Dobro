// FILE: frontend/src/lib/auth.real.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Authenticate against Supabase and map backend profiles to the app User.
//   SCOPE: Login, register, logout, session restore, onboarding flags, supabase client
//   DEPENDS: M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-AUTH V-M-FRONTEND-AUTH M-FRONTEND-TYPES
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   supabase - Supabase browser client
//   login - email/password sign-in plus /profile/me mapping
//   register - email sign-up plus /profile/me mapping
//   logout - clear JWT and sign out of Supabase
//   getCurrentSession - restore JWT or Supabase session via /profile/me
//   isOnboardingComplete - read onboardingComplete flag
//   setOnboardingComplete - persist onboardingComplete flag
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

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
import { getIconComponent } from './iconMap';

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

const getIcon = (iconName?: string | null): React.FC<any> =>
  getIconComponent(iconName);

const profileStatIdMap: Record<string, string> = {
  '1': 'hours',
  '2': 'karma',
};

// Бэкенд не присылает иконки для статов — назначаем по метрике.
const STAT_ICONS: Record<string, string> = { hours: 'Clock', karma: 'Sparkles' };

const mapBackendProfileToAppUser = (backendProfile: any): User => {
  // START_BLOCK_MAP_BACKEND_PROFILE
  const stats = (backendProfile.stats || []).map((stat: any) => {
    const mappedId = profileStatIdMap[stat.id] || stat.id;
    const iconName = stat.icon || STAT_ICONS[mappedId] || 'Star';
    return { ...stat, id: mappedId, icon: iconName, Icon: getIcon(iconName) };
  });

  const achievements = (backendProfile.achievements || [])
    .slice(0, 5)
    .map((userAchievement: any) => ({
      id: userAchievement.achievement.id,
      name: userAchievement.achievement.name,
      icon: userAchievement.achievement.icon ?? 'Award',
      Icon: getIcon(userAchievement.achievement.icon ?? 'Award'),
    }));

  return {
    id: backendProfile.id,
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
  // END_BLOCK_MAP_BACKEND_PROFILE
};

// START_CONTRACT: login
//   PURPOSE: Sign in with Supabase and load the backend profile
//   INPUTS: { email: string; password: string }
//   OUTPUTS: { Promise<{ user: User; token: string }> - mapped profile and access token }
//   SIDE_EFFECTS: creates a Supabase session; signs out if /profile/me fails
//   LINKS: M-FRONTEND-AUTH export-login
// END_CONTRACT: login
export const login = async (
  email: string,
  password: string,
): Promise<{ user: User; token: string }> => {
  // START_BLOCK_LOGIN
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
  // END_BLOCK_LOGIN
};

// START_CONTRACT: register
//   PURPOSE: Sign up with Supabase and load the backend profile after webhook delay
//   INPUTS: { userData: { firstName, lastName, email, password } }
//   OUTPUTS: { Promise<{ user: User; token: string }> - mapped profile and access token }
//   SIDE_EFFECTS: creates a Supabase user/session; signs out if /profile/me fails
//   LINKS: M-FRONTEND-AUTH export-register
// END_CONTRACT: register
export const register = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  // START_BLOCK_REGISTER
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
  // END_BLOCK_REGISTER
};

// START_CONTRACT: logout
//   PURPOSE: Clear the internal JWT and sign out of Supabase
//   INPUTS: { none }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: removes localStorage keys and ends the Supabase session
//   LINKS: M-FRONTEND-AUTH export-logout
// END_CONTRACT: logout
export const logout = async (): Promise<void> => {
  localStorage.removeItem('internal_jwt');
  localStorage.removeItem('onboardingComplete');
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error.message);
  }
};

// START_CONTRACT: getCurrentSession
//   PURPOSE: Restore the current user from internal JWT or Supabase session
//   INPUTS: { none }
//   OUTPUTS: { Promise<{ user: User; token: string } | null> - session or null }
//   SIDE_EFFECTS: logs out only on 401/403; keeps token on transient errors
//   LINKS: M-FRONTEND-AUTH export-getCurrentSession
// END_CONTRACT: getCurrentSession
export const getCurrentSession = async (): Promise<{
  user: User;
  token: string;
} | null> => {
  // START_BLOCK_RESTORE_SESSION
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

    if (profileResponse.ok) {
      const backendProfile = await profileResponse.json();
      return {
        user: mapBackendProfileToAppUser(backendProfile),
        token: token,
      };
    }

    // Разлогиниваем ТОЛЬКО при реальной невалидности токена (401/403).
    if (profileResponse.status === 401 || profileResponse.status === 403) {
      await logout();
      return null;
    }

    // Прочие ошибки (5xx, бэкенд перезапускается при деплое, и т.п.) — НЕ
    // сбрасываем токен. Бросаем ошибку, чтобы показать экран «повторить»,
    // а не окно входа; сессия восстановится после возврата бэкенда.
    throw new Error(`Проверка сессии не удалась (${profileResponse.status})`);
  } catch (e) {
    // Сетевые/транзиентные ошибки — токен сохраняем, пробрасываем выше.
    console.error('Error during session check (token kept):', e);
    throw e;
  }
  // END_BLOCK_RESTORE_SESSION
};

const ONBOARDING_KEY = 'onboardingComplete';

// START_CONTRACT: isOnboardingComplete
//   PURPOSE: Read whether onboarding has been completed
//   INPUTS: { none }
//   OUTPUTS: { boolean - true when onboardingComplete is stored }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-AUTH
// END_CONTRACT: isOnboardingComplete
export const isOnboardingComplete = (): boolean => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

// START_CONTRACT: setOnboardingComplete
//   PURPOSE: Persist the onboarding-complete flag
//   INPUTS: { none }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: writes onboardingComplete to localStorage
//   LINKS: M-FRONTEND-AUTH
// END_CONTRACT: setOnboardingComplete
export const setOnboardingComplete = (): void => {
  localStorage.setItem(ONBOARDING_KEY, 'true');
};
