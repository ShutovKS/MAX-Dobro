import {defaultUserData, organizationUserData} from './mockData';
import type {User} from './types';

const USER_SESSION_KEY = 'userSession';
const ONBOARDING_KEY = 'onboardingComplete';

const SIMULATED_DELAY = 500;

export const login = (email: string, password: string): Promise<{ user: User }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'organizer@test.com' && password) {
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(organizationUserData));
        resolve({user: organizationUserData});
      } else if (email && password && /^\S+@\S+\.\S+$/.test(email)) {
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(defaultUserData));
        resolve({user: defaultUserData});
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, SIMULATED_DELAY);
  });
};

export const register = (data: { firstName: string, lastName: string, email: string }): Promise<{ user: User }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user: User = {...defaultUserData, firstName: data.firstName, lastName: data.lastName, role: 'volunteer'};
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
      resolve({user});
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

export const getCurrentSession = (): Promise<{ user: User } | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userJson = localStorage.getItem(USER_SESSION_KEY);
      if (userJson) {
        try {
          const user = JSON.parse(userJson) as User;
          resolve({user});
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