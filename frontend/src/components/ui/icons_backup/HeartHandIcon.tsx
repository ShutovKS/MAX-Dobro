import React from 'react';
import type {IconProps} from './types';

const HeartHandIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#007AFF"/>
        <stop offset="100%" stopColor="#5856D6"/>
      </linearGradient>
    </defs>
    <path
      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      fill="url(#logoGradient)" stroke="none" className="animate-pulse" style={{animationDuration: '1.5s'}}/>
    <path d="M12 5.524a5.5 5.5 0 0 1 0 13.052c-4.34-2.6-4.9-6-4.9-6s.56-3.4 4.9-6Z" fill="white" stroke="none"/>
    <path
      d="M12.57 18.52a.5.5 0 0 0 .86 0L19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l2.71 2.71a.5.5 0 0 0 .71 0Z"
      stroke="url(#logoGradient)"/>
  </svg>
);

export default HeartHandIcon;