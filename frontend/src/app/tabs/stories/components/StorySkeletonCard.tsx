// FILE: frontend/src/app/tabs/stories/components/StorySkeletonCard.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Placeholder skeleton card while the stories feed loads.
//   SCOPE: Pulse layout matching StoryCard
//   DEPENDS: M-FRONTEND-UI
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   StorySkeletonCard - stories feed loading placeholder
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';

// START_CONTRACT: StorySkeletonCard
//   PURPOSE: Render a pulse placeholder matching StoryCard layout
//   INPUTS: { none }
//   OUTPUTS: { ReactElement - skeleton card }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
// END_CONTRACT: StorySkeletonCard
const StorySkeletonCard: React.FC = () => (
  // START_BLOCK_RENDER_SKELETON
  <div className="bg-white rounded-2xl shadow-sm p-4 animate-pulse w-full max-w-lg mx-auto">
    <div className="flex items-center mb-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="ml-3 flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="w-full h-64 bg-gray-200 rounded-lg mb-3"></div>
    <div className="flex justify-between items-center">
      <div className="flex space-x-4">
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 w-8 bg-gray-200 rounded"></div>
    </div>
  </div>
  // END_BLOCK_RENDER_SKELETON
);

export default StorySkeletonCard;