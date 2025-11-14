import React from 'react';
import type {IconProps} from './types';

const MaxIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path
      d="M22 6.5a4.5 4.5 0 0 0-4.5-4.5H6.5A4.5 4.5 0 0 0 2 6.5v6.25a4.5 4.5 0 0 0 4.5 4.5h2.25a.75.75 0 0 1 .69.46L11.25 22h1.5l1.81-4.29a.75.75 0 0 1 .69-.46h2.25a4.5 4.5 0 0 0 4.5-4.5V6.5Z"/>
  </svg>
);

export default MaxIcon;