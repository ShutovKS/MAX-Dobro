import React from 'react';
import type {IconProps} from './types';

const MegaphoneIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      {/* Person */}
      <g transform="translate(-30, 0)">
        <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
        <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      </g>

      {/* Megaphone */}
      <g transform="translate(15, -15) rotate(15)">
        <path d="M 0 0 L -10 -15 L 30 -25 L 40 -5 Z" fill="#bdbdbd"/>
        <rect x="0" y="-5" width="20" height="10" rx="3" fill="#9e9e9e"/>
        <circle cx="40" cy="-15" r="20" fill="#f5f5f5"/>
        <circle cx="40" cy="-15" r="15" fill="#e0e0e0"/>
      </g>
    </g>
  </svg>
);

export default MegaphoneIllustrationIcon;
