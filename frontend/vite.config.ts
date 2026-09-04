// FILE: frontend/vite.config.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Vite bundler config for the React mini-app.
//   SCOPE: dev server, React plugin, env defines, path alias
//   DEPENDS: none
//   LINKS: M-FRONTEND-ENTRY, V-M-FRONTEND-ENTRY
//   ROLE: CONFIG
//   MAP_MODE: NONE
// END_MODULE_CONTRACT
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
