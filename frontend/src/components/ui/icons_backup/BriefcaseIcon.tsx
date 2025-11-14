import React from 'react';
import type {IconProps} from './types';

const BriefcaseIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
       stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M20.25 14.15v4.075c0 1.313-.964 2.446-2.25 2.654l-5.25 1.106a2.25 2.25 0 01-1.998 0l-5.25-1.106A2.25 2.25 0 013.75 18.225V14.15M3.75 14.15L2.25 13.5m18 0l-1.5.65M12 7.5h.008v.008H12V7.5zm0 3.75h.008v.008H12v-.008zm0 3.75h.008v.008H12v-.008zm-3.75-3.75h.008v.008H8.25v-.008zm0 3.75h.008v.008H8.25v-.008zm3.75-7.5h.008v.008H12V3.75zM8.25 7.5h.008v.008H8.25V7.5z"/>
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v4.159c0 .714-.383 1.37-1.002 1.7L12 15.25l-7.248-3.389A1.875 1.875 0 013.75 10.159V6z"/>
  </svg>
);

export default BriefcaseIcon;
