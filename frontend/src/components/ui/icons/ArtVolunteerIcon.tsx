// FILE: frontend/src/components/ui/icons/ArtVolunteerIcon.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Art volunteer category illustration icon.
//   SCOPE: Render SVG icon from IconProps
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   ArtVolunteerIcon - SVG icon for art volunteer category
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import type {IconProps} from './types';

// START_CONTRACT: ArtVolunteerIcon
//   PURPOSE: Render the art-volunteer SVG icon
//   INPUTS: { props: IconProps - SVG attributes }
//   OUTPUTS: { ReactElement - SVG icon }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: ArtVolunteerIcon
const ArtVolunteerIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20,80 C40,90 60,90 80,80 C90,70 90,50 80,40 C70,30 50,20 40,30 C30,40 10,70 20,80 Z" fill="#a2d5f2"/>
    <circle cx="35" cy="55" r="8" fill="#ffc107"/>
    <circle cx="55" cy="45" r="10" fill="#e91e63"/>
    <circle cx="70" cy="60" r="7" fill="#4caf50"/>
    <path d="M25,25 L45,15 L50,35 L30,45 Z" fill="#8d6e63"/>
    <path d="M45,15 L80,50" stroke="#5d4037" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

export default ArtVolunteerIcon;
