import React from 'react';
import type {IconProps} from './types';

const RefreshIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348A9 9 0 1 1 5.977 9.348"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.999 2.083v4.667h4.667"/>
  </svg>
);

export default RefreshIcon;