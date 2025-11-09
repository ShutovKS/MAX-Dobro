import React from 'react';
import type {IconProps} from './types';

const AnimalFriendIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50,15 C25,15 15,40 15,55 C15,80 30,90 50,90 C70,90 85,80 85,55 C85,40 75,15 50,15 Z" fill="#ffd3b6"/>
    <circle cx="35" cy="45" r="8" fill="#6c5b7b"/>
    <circle cx="65" cy="45" r="8" fill="#6c5b7b"/>
    <path d="M50,65 C55,75 45,75 50,65 Z" fill="#6c5b7b"/>
    <path d="M30,25 A10,10 0 0,1 20,15" fill="none" stroke="#6c5b7b" strokeWidth="4"/>
    <path d="M70,25 A10,10 0 0,0 80,15" fill="none" stroke="#6c5b7b" strokeWidth="4"/>
  </svg>
);

export default AnimalFriendIcon;