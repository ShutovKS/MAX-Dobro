import React from 'react';
import type {IconProps} from './types';

const ServerErrorIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
       strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g stroke="#d1d5db">
      <path d="M12 20v-3.5"/>
      <path d="M12 7.5V4"/>
      <path d="m4.93 4.93 2.47 2.47"/>
      <path d="M17.66 17.66-2.47-2.47"/>
      <path d="m19.07 4.93-2.47 2.47"/>
      <path d="M22 12h-3.5"/>
      <path d="M5.5 12H2"/>
      <path d="m6.34 17.66 1.05-1.05"/>
    </g>

    <path d="M13.4 15.6a4 4 0 0 0-2.8 0l-2.4-4.1a4 4 0 0 0 6.8-.1l-1.6 4.2z" stroke="#d1d5db"/>

    <path d="M16.6 15.6 14 11.5" stroke="#FF303C" strokeWidth="2"/>
  </svg>
);

export default ServerErrorIcon;
