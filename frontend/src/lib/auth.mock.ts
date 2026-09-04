// FILE: frontend/src/lib/auth.mock.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Simulate volunteer and organizer sessions against localStorage.
//   SCOPE: Mock login, register, logout, session restore, and onboarding flags
//   DEPENDS: M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-AUTH V-M-FRONTEND-AUTH M-FRONTEND-TYPES
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   login - store a volunteer or organizer mock session
//   register - create a volunteer mock session
//   logout - clear mock session and onboarding keys
//   getCurrentSession - restore a stored mock session
//   isOnboardingComplete - read onboardingComplete flag
//   setOnboardingComplete - persist onboardingComplete flag
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {defaultUserData, organizationUserData} from './mockData';
import type {User} from './types';

const USER_SESSION_KEY = 'userSession';
const ONBOARDING_KEY = 'onboardingComplete';

const SIMULATED_DELAY = 500;

// START_CONTRACT: login
//   PURPOSE: Authenticate a mock volunteer or organizer and persist the session
//   INPUTS: { email: string - login email; password: string - any non-empty password }
//   OUTPUTS: { Promise<{ user: User; token: string }> - stored mock session }
//   SIDE_EFFECTS: writes userSession to localStorage
//   LINKS: M-FRONTEND-AUTH export-login
// END_CONTRACT: login
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

// START_CONTRACT: register
//   PURPOSE: Create a mock volunteer session from registration fields
//   INPUTS: { data: { firstName, lastName, email, password } }
//   OUTPUTS: { Promise<{ user: User; token: string }> - stored mock session }
//   SIDE_EFFECTS: writes userSession to localStorage
//   LINKS: M-FRONTEND-AUTH export-register
// END_CONTRACT: register
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

// START_CONTRACT: logout
//   PURPOSE: Clear the mock session and onboarding flag
//   INPUTS: { none }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: removes userSession and onboardingComplete from localStorage
//   LINKS: M-FRONTEND-AUTH export-logout
// END_CONTRACT: logout
export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem(USER_SESSION_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    resolve();
  });
};

// START_CONTRACT: getCurrentSession
//   PURPOSE: Restore a previously stored mock session
//   INPUTS: { none }
//   OUTPUTS: { Promise<{ user: User; token: string } | null> - session or null }
//   SIDE_EFFECTS: may remove a corrupt userSession key
//   LINKS: M-FRONTEND-AUTH export-getCurrentSession
// END_CONTRACT: getCurrentSession
export const getCurrentSession = (): Promise<{ user: User; token: string } | null> => {
  return new Promise((resolve) => {
    // START_BLOCK_RESTORE_MOCK_SESSION
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
    // END_BLOCK_RESTORE_MOCK_SESSION
  });
};

// START_CONTRACT: isOnboardingComplete
//   PURPOSE: Read whether mock onboarding has been completed
//   INPUTS: { none }
//   OUTPUTS: { boolean - true when onboardingComplete is stored }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-AUTH
// END_CONTRACT: isOnboardingComplete
export const isOnboardingComplete = (): boolean => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

// START_CONTRACT: setOnboardingComplete
//   PURPOSE: Persist the mock onboarding-complete flag
//   INPUTS: { none }
//   OUTPUTS: { void }
//   SIDE_EFFECTS: writes onboardingComplete to localStorage
//   LINKS: M-FRONTEND-AUTH
// END_CONTRACT: setOnboardingComplete
export const setOnboardingComplete = (): void => {
  localStorage.setItem(ONBOARDING_KEY, 'true');
};
