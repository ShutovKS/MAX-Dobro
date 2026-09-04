// FILE: frontend/src/components/ui/icons/PhotoAlbumIllustrationIcon.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Empty-album camera illustration icon.
//   SCOPE: Render SVG icon from IconProps
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   PhotoAlbumIllustrationIcon - empty-album camera illustration
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import type {IconProps} from './types';

// START_CONTRACT: PhotoAlbumIllustrationIcon
//   PURPOSE: Render the photo-album empty-state illustration
//   INPUTS: { props: IconProps - SVG attributes }
//   OUTPUTS: { ReactElement - SVG icon }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: PhotoAlbumIllustrationIcon
const PhotoAlbumIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      <g transform="translate(45, 10)">
        <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
        <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      </g>
      <g transform="translate(-30, 0)">
        <rect x="-30" y="-20" width="60" height="40" rx="5" fill="#bdbdbd"/>
        <circle cx="0" cy="0" r="15" fill="#f5f5f5"/>
        <circle cx="0" cy="0" r="10" fill="#616161"/>
        <rect x="15" y="-28" width="10" height="8" rx="2" fill="#9e9e9e"/>
      </g>
    </g>
  </svg>
);

export default PhotoAlbumIllustrationIcon;
