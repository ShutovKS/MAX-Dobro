// FILE: frontend/src/app/splash/page.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Show the branded splash while the mini-app session initializes.
//   SCOPE: Full-screen logo and tagline with no data loading
//   DEPENDS: M-FRONTEND-UI
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   SplashPage - branded loading splash screen
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import {HeartHandIcon} from '../../components/ui/icons';

// START_CONTRACT: SplashPage
//   PURPOSE: Render the MAX Добро splash while session restore runs
//   INPUTS: { none }
//   OUTPUTS: { ReactElement - full-screen splash }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
// END_CONTRACT: SplashPage
const SplashPage: React.FC = () => {
  // START_BLOCK_RENDER_SPLASH
  return (
    <div className="bg-white w-full h-screen flex items-center justify-center font-sans antialiased">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <HeartHandIcon className="w-28 h-28 text-[#007AFF]"/>
        <h1 className="text-5xl font-bold tracking-tight text-[#0C0D0E]">
          MAX<span className="text-[#007AFF]">Добро</span>
        </h1>
        <p className="text-sm font-medium tracking-[0.2em] text-[rgba(12,13,14,0.52)] uppercase">
          Платформа для волонтёров
        </p>
      </div>
    </div>
  );
  // END_BLOCK_RENDER_SPLASH
};

export default SplashPage;
