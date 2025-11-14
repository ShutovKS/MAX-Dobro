import React from 'react';
import type {IconProps} from './types';

const NoNetworkIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
       strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5 5L19 19" stroke="#FF303C" strokeWidth="2"/>

    <g stroke="#d1d5db">
      <path d="M8.7 9.8a7 7 0 0 1 6.6 0"/>
      <path d="M6.3 12.2a11 11 0 0 1 11.4 0"/>
      <path d="M12 17.1h.01"/>
    </g>
  </svg>
);

export default NoNetworkIcon;
