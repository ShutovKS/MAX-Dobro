import React from 'react';
import type {IconProps} from './types';

const NatureProtectorIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50,95 C50,95 20,75 20,45 C20,25 35,10 50,25 C65,10 80,25 80,45 C80,75 50,95 50,95 Z" fill="#a8e6cf"/>
    <path d="M50,90 C50,90 25,70 25,45 C25,28 38,15 50,28 C62,15 75,28 75,45 C75,70 50,90 50,90 Z" fill="#81c784"/>
    <path d="M50,28 C50,20 55,15 60,20 C65,25 60,30 55,30 C50,30 50,35 50,28 Z" fill="#dcedc8"/>
  </svg>
);

export default NatureProtectorIcon;