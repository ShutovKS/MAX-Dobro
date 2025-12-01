import {defaultUserData, organizationUserData} from './mockData';
import type {User} from './types';

const USER_SESSION_KEY = 'userSession';
const ONBOARDING_KEY = 'onboardingComplete';

const SIMULATED_DELAY = 500;

export const login = (email: string, password: string): Promise<{ user: User; token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'organizer@test.com' && password) {
        const session = {user: organizationUserData, token: 'mock-organizer-token'};
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
        resolve(session);
      } else if (email && password && /^\S+@\S+\.\S+$/.test(email)) {
        const session = {user: defaultUserData, token: 'mock-volunteer-token'};
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
        resolve(session);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, SIMULATED_DELAY);
  });
};

export const register = (data: { firstName: string; lastName: string; email: string; password: string }): Promise<{
  user: User;
  token: string
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user: User = {...defaultUserData, firstName: data.firstName, lastName: data.lastName, role: 'volunteer'};
      const session = {user, token: 'mock-new-user-token'};
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
      resolve(session);
    }, SIMULATED_DELAY);
  });
};

export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem(USER_SESSION_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    resolve();
  });
};

export const getCurrentSession = (): Promise<{ user: User; token: string } | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sessionJson = localStorage.getItem(USER_SESSION_KEY);
      if (sessionJson) {
        try {
          const session = JSON.parse(sessionJson);
          let user: User;
          if (session.user && session.token) {
            user = session.user;
          } else {
            user = session as User;
          }
          if (user.achievements && user.achievements.length > 0 && !user.achievements[0].icon) {
            user.achievements = defaultUserData.achievements;
          }
          resolve({user, token: session.token || 'mock-retrieved-token'});
        } catch (e) {
          localStorage.removeItem(USER_SESSION_KEY);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }, SIMULATED_DELAY / 2);
  });
};

export const isOnboardingComplete = (): boolean => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

export const setOnboardingComplete = (): void => {
  localStorage.setItem(ONBOARDING_KEY, 'true');
};
