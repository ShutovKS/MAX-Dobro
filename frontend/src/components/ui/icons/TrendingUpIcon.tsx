import React from 'react';
import type {IconProps} from './types';

const TrendingUpIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.182.825m3.182-.825V18m0-12.75l-3.182.825"/>
  </svg>
);

export default TrendingUpIcon;
