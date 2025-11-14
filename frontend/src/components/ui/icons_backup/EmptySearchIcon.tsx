import React from 'react';
import type {IconProps} from './types';

const EmptySearchIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19Z"/>
    <path d="M22 22 18 18"/>
    <path d="m8.5 8.5 7 7"/>
    <path d="m15.5 8.5-7 7"/>
  </svg>
);

export default EmptySearchIcon;