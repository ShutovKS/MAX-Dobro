import React from 'react';
import type {IconProps} from './types';

const MagnifyingGlassIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      {/* Person */}
      <circle cx="25" cy="-25" r="12" fill="#e0e0e0"/>
      <path d="M 10 -10 C 10 20, 40 20, 40 -10 L 35 -10 A 10 10 0 0 1 15 -10 Z" fill="#f5f5f5"/>

      {/* Magnifying Glass */}
      <g transform="rotate(45)">
        <circle cx="-15" cy="-15" r="30" fill="#e0e0e0"/>
        <circle cx="-15" cy="-15" r="24" fill="#f5f5f5"/>
        <rect x="10" y="-20" width="25" height="10" rx="5" fill="#bdbdbd"/>
      </g>

      {/* Empty Paper */}
      <path d="M -50, 0 L 10, -30 L 30, 20 L -30, 50 Z" fill="#fff" stroke="#e0e0e0" strokeWidth="2"/>
    </g>
  </svg>
);

export default MagnifyingGlassIllustrationIcon;