import React from 'react';
import type {IconProps} from './types';

const BronzeMedalIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <defs>
      <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CD7F32"/>
        <stop offset="100%" stopColor="#A0522D"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="8" r="6" fill="url(#bronzeGradient)" stroke="#8B4513" strokeWidth="1"/>
    <path d="M8 14v4l4 2 4-2v-4" stroke="#8B4513" strokeWidth="1.5" fill="#CD7F32"/>
    <path d="M12 11l-1-2h2l-1 2Z" fill="white"/>
  </svg>
);

export default BronzeMedalIcon;