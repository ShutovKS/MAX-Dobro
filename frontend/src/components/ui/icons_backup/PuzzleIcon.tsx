import React from 'react';
import type {IconProps} from './types';

const PuzzleIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
       strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M14 7h.01"/>
    <path d="M10.5 17.5v.01"/>
    <path d="M17.5 10.5h.01"/>
    <path d="M7 14v.01"/>
    <path
      d="M17.5 14a3.5 3.5 0 0 0-3.5-3.5h-1a3.5 3.5 0 0 0-3.5 3.5v1a3.5 3.5 0 0 0 3.5 3.5h1a3.5 3.5 0 0 0 3.5-3.5v-1"/>
    <path d="M3.5 14a3.5 3.5 0 0 0 3.5 3.5h1"/>
    <path d="M14 3.5a3.5 3.5 0 0 0-3.5 3.5v1"/>
    <path d="M10.5 20.5a3.5 3.5 0 0 0 3.5-3.5v-1"/>
    <path d="M20.5 10.5a3.5 3.5 0 0 0-3.5-3.5h-1"/>
  </svg>
);

export default PuzzleIcon;