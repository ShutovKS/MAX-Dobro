// FILE: frontend/src/components/ui/SkeletonCard.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Pulse placeholder that matches EventCard layout.
//   SCOPE: Render a single loading card skeleton
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   SkeletonCard - event-card shaped loading placeholder
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';

// START_CONTRACT: SkeletonCard
//   PURPOSE: Render an event-card loading placeholder
//   INPUTS: { none }
//   OUTPUTS: { ReactElement - pulse skeleton card }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: SkeletonCard
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 animate-pulse">
    <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
    <div className="flex-1 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

export default SkeletonCard;
