import React from 'react';
import type {IconProps} from './types';

const BinocularsIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
      <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      <g transform="translate(0, -25)">
        <path d="M -30 -10 L -10 -15 L -10 15 L -30 10 Z" fill="#616161"/>
        <path d="M 30 -10 L 10 -15 L 10 15 L 30 10 Z" fill="#616161"/>
        <rect x="-15" y="-5" width="30" height="10" fill="#424242"/>
        <circle cx="-30" cy="0" r="12" fill="#9e9e9e"/>
        <circle cx="30" cy="0" r="12" fill="#9e9e9e"/>
        <circle cx="-30" cy="0" r="8" fill="#e0e0e0"/>
        <circle cx="30" cy="0" r="8" fill="#e0e0e0"/>
      </g>
      <path d="M 50, -40 a 5,5 0 1,1 -10,0 5,5 0 1,1 10,0" fill="#e0e0e0" opacity="0.7"/>
      <path d="M -60, 20 a 8,8 0 1,1 -16,0 8,8 0 1,1 16,0" fill="#e0e0e0" opacity="0.7"/>
      <path d="M 60, 50 a 4,4 0 1,1 -8,0 4,4 0 1,1 8,0" fill="#e0e0e0" opacity="0.7"/>
    </g>
  </svg>
);

export default BinocularsIllustrationIcon;