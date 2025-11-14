import * as realAuth from './auth.real';
import * as mockAuth from './auth.mock';

const isReal = process.env.API_MODE === 'real';

const auth = isReal ? realAuth : mockAuth;

export const {
  login,
  register,
  logout,
  getCurrentSession,
  isOnboardingComplete,
  setOnboardingComplete,
} = auth;

export const supabase = isReal ? realAuth.supabase : null;