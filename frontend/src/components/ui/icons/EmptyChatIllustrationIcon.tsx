// FILE: frontend/src/components/ui/icons/EmptyChatIllustrationIcon.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Empty-chat illustration icon.
//   SCOPE: Render SVG icon from IconProps
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EmptyChatIllustrationIcon - empty-chat phone illustration
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import type {IconProps} from './types';

// START_CONTRACT: EmptyChatIllustrationIcon
//   PURPOSE: Render the empty-chat illustration
//   INPUTS: { props: IconProps - SVG attributes }
//   OUTPUTS: { ReactElement - SVG icon }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: EmptyChatIllustrationIcon
const EmptyChatIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      <rect x="10" y="-30" width="40" height="80" rx="8" fill="#e0e0e0"/>
      <rect x="15" y="-25" width="30" height="60" fill="#f5f5f5"/>
      <circle cx="30" cy="40" r="3" fill="#bdbdbd"/>
      <g transform="translate(-30, 10)">
        <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
        <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      </g>
      <g transform="translate(50, -20) rotate(15)">
        <text fontSize="12" fill="#bdbdbd" fontFamily="Arial" fontWeight="bold">z</text>
        <text x="5" y="5" fontSize="16" fill="#bdbdbd" fontFamily="Arial" fontWeight="bold">Z</text>
        <text x="12" y="12" fontSize="20" fill="#bdbdbd" fontFamily="Arial" fontWeight="bold">z</text>
      </g>
    </g>
  </svg>
);

export default EmptyChatIllustrationIcon;
