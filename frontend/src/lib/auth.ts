// FILE: frontend/src/lib/auth.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Switch mock session helpers and real Supabase-backed login/register/logout.
//   SCOPE: VITE_API_MODE auth adapter selection and session helper re-exports
//   DEPENDS: M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-AUTH V-M-FRONTEND-AUTH
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   adapter selection - picks auth.real or auth.mock from VITE_API_MODE
//   session surface - re-exports login, register, logout, demo organizer, and onboarding helpers
//   supabase - real client when VITE_API_MODE is real, otherwise null
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.1.0 - Re-export loginAsDemoOrganizer for the organization demo entry]
// END_CHANGE_SUMMARY

import * as realAuth from './auth.real';
import * as mockAuth from './auth.mock';

// START_BLOCK_SELECT_AUTH_ADAPTER
const isReal = import.meta.env.VITE_API_MODE === 'real';

const auth = isReal ? realAuth : mockAuth;
// END_BLOCK_SELECT_AUTH_ADAPTER

export const {
  login,
  register,
  loginAsDemoOrganizer,
  logout,
  getCurrentSession,
  isOnboardingComplete,
  setOnboardingComplete,
} = auth;

export const supabase = isReal ? realAuth.supabase : null;
