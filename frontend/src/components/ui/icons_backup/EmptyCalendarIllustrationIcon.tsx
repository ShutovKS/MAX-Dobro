import React from 'react';
import type {IconProps} from './types';

const EmptyCalendarIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      {/* Calendar */}
      <rect x="-50" y="-40" width="100" height="80" rx="10" fill="#fff" stroke="#e0e0e0" strokeWidth="2"/>
      <rect x="-50" y="-40" width="100" height="20" rx="10" ry="10" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="2"/>
      <circle cx="-35" cy="-30" r="4" fill="#e0e0e0"/>
      <circle cx="-15" cy="-30" r="4" fill="#e0e0e0"/>
      <circle cx="5" cy="-30" r="4" fill="#e0e0e0"/>

      {/* Person */}
      <g transform="translate(45, 10)">
        <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
        <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      </g>
      {/* Question Mark */}
      <text x="0" y="10" fontSize="40" fill="#bdbdbd" textAnchor="middle" fontFamily="Arial, sans-serif"
            fontWeight="bold">?
      </text>
    </g>
  </svg>
);

export default EmptyCalendarIllustrationIcon;