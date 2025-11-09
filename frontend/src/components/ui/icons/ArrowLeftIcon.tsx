import React from 'react';
import type {IconProps} from './types';

const ArrowLeftIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 12H5"/>
    <path d="m12 19-7-7 7-7"/>
  </svg>
);

export default ArrowLeftIcon;