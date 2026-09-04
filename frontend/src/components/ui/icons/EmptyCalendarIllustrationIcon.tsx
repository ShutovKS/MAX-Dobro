// FILE: frontend/src/components/ui/icons/EmptyCalendarIllustrationIcon.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Empty-events calendar illustration icon.
//   SCOPE: Render SVG icon from IconProps
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EmptyCalendarIllustrationIcon - empty-events calendar illustration
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import type {IconProps} from './types';

// START_CONTRACT: EmptyCalendarIllustrationIcon
//   PURPOSE: Render the empty-calendar illustration
//   INPUTS: { props: IconProps - SVG attributes }
//   OUTPUTS: { ReactElement - SVG icon }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: EmptyCalendarIllustrationIcon
const EmptyCalendarIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      <rect x="-50" y="-40" width="100" height="80" rx="10" fill="#fff" stroke="#e0e0e0" strokeWidth="2"/>
      <rect x="-50" y="-40" width="100" height="20" rx="10" ry="10" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="2"/>
      <circle cx="-35" cy="-30" r="4" fill="#e0e0e0"/>
      <circle cx="-15" cy="-30" r="4" fill="#e0e0e0"/>
      <circle cx="5" cy="-30" r="4" fill="#e0e0e0"/>
      <g transform="translate(45, 10)">
        <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
        <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      </g>
      <text x="0" y="10" fontSize="40" fill="#bdbdbd" textAnchor="middle" fontFamily="Arial, sans-serif"
            fontWeight="bold">?
      </text>
    </g>
  </svg>
);

export default EmptyCalendarIllustrationIcon;
