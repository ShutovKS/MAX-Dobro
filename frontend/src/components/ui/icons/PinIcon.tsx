import React from 'react';
import type {IconProps} from './types';

const PinIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd"
          d="M9.528 1.718a.75.75 0 01.744.042l8.25 6a.75.75 0 01-.042 1.33L12 11.25v6.542l3.43-2.287a.75.75 0 11.74 1.33l-4.5 3a.75.75 0 01-.86 0l-4.5-3a.75.75 0 11.74-1.33L10.5 17.792v-6.542L3.528 9.09a.75.75 0 01-.042-1.33l8.25-6a.75.75 0 01.792-.042z"
          clipRule="evenodd"/>
  </svg>
);

export default PinIcon;
