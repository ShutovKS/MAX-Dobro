// FILE: frontend/src/components/ui/icons/MaxIcon.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: MAX messenger brand bubble icon.
//   SCOPE: Render SVG icon from IconProps
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   MaxIcon - MAX messenger bubble SVG icon
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import type {IconProps} from './types';

// START_CONTRACT: MaxIcon
//   PURPOSE: Render the MAX messenger SVG icon
//   INPUTS: { props: IconProps - SVG attributes }
//   OUTPUTS: { ReactElement - SVG icon }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: MaxIcon
const MaxIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path
      d="M22 6.5a4.5 4.5 0 0 0-4.5-4.5H6.5A4.5 4.5 0 0 0 2 6.5v6.25a4.5 4.5 0 0 0 4.5 4.5h2.25a.75.75 0 0 1 .69.46L11.25 22h1.5l1.81-4.29a.75.75 0 0 1 .69-.46h2.25a4.5 4.5 0 0 0 4.5-4.5V6.5Z"/>
  </svg>
);

export default MaxIcon;
