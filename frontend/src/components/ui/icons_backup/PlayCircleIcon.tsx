import React from 'react';
import type {IconProps} from './types';

const PlayCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-3.028a.75.75 0 01.75.75v6.546a.75.75 0 01-1.141.662l-5.223-3.272a.75.75 0 010-1.324l5.223-3.272a.75.75 0 01.391-.138z"
          clipRule="evenodd"/>
  </svg>
);

export default PlayCircleIcon;