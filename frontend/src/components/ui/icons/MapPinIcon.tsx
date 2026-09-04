// FILE: frontend/src/components/ui/icons/MapPinIcon.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Map pin illustration icon.
//   SCOPE: Render SVG icon from IconProps
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   MapPinIcon - gradient map-pin SVG icon
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import type {IconProps} from './types';

// START_CONTRACT: MapPinIcon
//   PURPOSE: Render the map-pin SVG icon
//   INPUTS: { props: IconProps - SVG attributes }
//   OUTPUTS: { ReactElement - SVG icon }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: MapPinIcon
const MapPinIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="pinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#007AFF"/>
        <stop offset="100%" stopColor="#5856D6"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
        <feOffset dx="0" dy="1" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="url(#pinGradient)" filter="url(#shadow)"/>
    <path d="M12 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" fill="white"/>
  </svg>
);

export default MapPinIcon;
