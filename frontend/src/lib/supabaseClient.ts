// FILE: frontend/src/lib/supabaseClient.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Create the shared browser Supabase client from Vite env.
//   SCOPE: Read VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, export supabase
//   DEPENDS: none
//   LINKS: M-FRONTEND-AUTH V-M-FRONTEND-AUTH
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   supabase - browser Supabase client used for storage and auth helpers
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
