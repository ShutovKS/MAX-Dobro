import React from 'react';
import type {IconProps} from './types';

const CalendarEmptyIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M12 14v.01"/>
    <path d="M12 18v.01"/>
    <path d="M16 14v.01"/>
    <path d="M8 14v.01"/>
    <path d="M8 18v.01"/>
  </svg>
);

export default CalendarEmptyIcon;