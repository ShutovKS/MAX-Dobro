// FILE: frontend/src/components/ui/icons/types.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Shared SVG icon prop type for illustration components.
//   SCOPE: IconProps alias of React SVG props
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   IconProps - SVG element props used by illustration icons
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
}
