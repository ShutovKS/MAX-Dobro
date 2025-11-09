import React from 'react';
import type {IconProps} from './types';

const ArrowRightOnRectangleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

export default ArrowRightOnRectangleIcon;