import {defaultUserData} from './mockData';
import type {User} from './types';

const JWT_KEY = 'authToken';
const ONBOARDING_KEY = 'onboardingComplete';

// Helper function to correctly encode Unicode strings to Base64
const utf8_to_b64 = (str: string) => {
  return btoa(unescape(encodeURIComponent(str)));
}

// Helper function to correctly decode Base64 strings to Unicode
const b64_to_utf8 = (str: string) => {
  return decodeURIComponent(escape(atob(str)));
}


// In a real app, this would be a real, signed JWT from the server.
const createMockToken = (user: User): string => {
  const header = utf8_to_b64(JSON.stringify({alg: 'HS256', typ: 'JWT'}));
  const payload = utf8_to_b64(JSON.stringify({
    userId: 1,
    firstName: user.firstName,
    exp: Date.now() + 24 * 60 * 60 * 1000
  })); // 24-hour expiry
  const signature = 'mock-signature-string-that-is-not-secure'; // Not a real signature
  return `${header}.${payload}.${signature}`;
};

const SIMULATED_DELAY = 500;

export const login = (email: string, password: string): Promise<{ user: User; token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate validation: any valid email and non-empty password will work for the mock
      if (email && password && /^\S+@\S+\.\S+$/.test(email)) {
        const user = {...defaultUserData};
        const token = createMockToken(user);
        localStorage.setItem(JWT_KEY, token);
        resolve({user, token});
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, SIMULATED_DELAY);
  });
};

export const register = (data: { firstName: string, lastName: string, email: string }): Promise<{
  user: User;
  token: string
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = {...defaultUserData, firstName: data.firstName, lastName: data.lastName};
      const token = createMockToken(user);
      localStorage.setItem(JWT_KEY, token);
      resolve({user, token});
    }, SIMULATED_DELAY);
  });
};

export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    resolve();
  });
};

export const getCurrentSession = (): Promise<{ user: User; token: string } | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = localStorage.getItem(JWT_KEY);
      if (token) {
        // In a real app, you'd decode and validate the token.
        // Here we just parse the mock payload to get user info.
        try {
          const payload = JSON.parse(b64_to_utf8(token.split('.')[1]));
          // check expiry
          if (payload.exp > Date.now()) {
            const user = {...defaultUserData, firstName: payload.firstName};
            resolve({user, token});
          } else {
            // Token expired
            localStorage.removeItem(JWT_KEY);
            resolve(null);
          }
        } catch (e) {
          // Invalid token
          localStorage.removeItem(JWT_KEY);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }, SIMULATED_DELAY / 2); // Faster check on startup
  });
};

export const isOnboardingComplete = (): boolean => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

export const setOnboardingComplete = (): void => {
  localStorage.setItem(ONBOARDING_KEY, 'true');
};