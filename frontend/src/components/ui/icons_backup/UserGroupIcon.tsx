import React from 'react';
import type {IconProps} from './types';

const UserGroupIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.964A3.375 3.375 0 0112 12.75a3.375 3.375 0 013.75 3.75m-3.75 0h-7.5a3.375 3.375 0 01-3.75-3.75A3.375 3.375 0 014.5 12.75v-2.53c0-.946.38-1.823 1.03-2.474l.493-.37c.21-.159.443-.28.693-.368m11.583 3.126c.25-.088.483-.209.693-.368l.493-.37a3.375 3.375 0 001.03-2.474v-2.53a3.375 3.375 0 00-3.75-3.75V6.75A3.375 3.375 0 0012 3.375a3.375 3.375 0 00-3.75 3.375v.098a3.375 3.375 0 00-1.5 2.894m15.375 6.465c-.325-.09-.65-.197-.983-.295m-12.39 0c-.333.098-.658.205-.983.295m7.5 0h-7.5"/>
  </svg>
);

export default UserGroupIcon;