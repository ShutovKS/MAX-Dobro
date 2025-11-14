import React from 'react';
import type {IconProps} from './types';

const DiplomaStandIllustrationIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="translate(80, 80)">
      <g transform="translate(-30, 0)">
        <rect x="-30" y="-50" width="60" height="80" rx="5" fill="#fff" stroke="#e0e0e0" strokeWidth="2"/>
        <path d="M -10 30 L 0 50 L 10 30" fill="none" stroke="#bdbdbd" strokeWidth="4"/>
        <rect x="-5" y="30" width="10" height="10" fill="#bdbdbd"/>
      </g>
      <g transform="translate(45, 10)">
        <circle cx="0" cy="-20" r="15" fill="#e0e0e0"/>
        <path d="M -25 5 C -25 30, 25 30, 25 5 L 15 5 A 20 20 0 0 1 -15 5 Z" fill="#f5f5f5"/>
      </g>
    </g>
  </svg>
);

export default DiplomaStandIllustrationIcon;