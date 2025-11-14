import React from 'react';
import type {IconProps} from './types';

const EmptyShelfIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      {/* Shelf */}
      <rect x="-60" y="20" width="120" height="8" rx="2" fill="#bdbdbd"/>
      <path d="M -50 20 L -40 40 L -30 20" fill="none" stroke="#bdbdbd" strokeWidth="4"/>
      <path d="M 50 20 L 40 40 L 30 20" fill="none" stroke="#bdbdbd" strokeWidth="4"/>

      {/* Person */}
      <g transform="translate(0, -10)">
        <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
        <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      </g>

      {/* Thought Bubble */}
      <g transform="translate(-40, -50)">
        <path d="M 0,0 a 20,15 0 1,1 0,0.1 z" fill="#f5f5f5"/>
        <circle cx="-15" cy="15" r="3" fill="#f5f5f5"/>
        <circle cx="-10" cy="20" r="2" fill="#f5f5f5"/>
      </g>
    </g>
  </svg>
);

export default EmptyShelfIllustrationIcon;