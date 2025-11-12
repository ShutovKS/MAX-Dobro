import React from 'react';
import type {IconProps} from './types';

const ArtVolunteerIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20,80 C40,90 60,90 80,80 C90,70 90,50 80,40 C70,30 50,20 40,30 C30,40 10,70 20,80 Z" fill="#a2d5f2"/>
    <circle cx="35" cy="55" r="8" fill="#ffc107"/>
    <circle cx="55" cy="45" r="10" fill="#e91e63"/>
    <circle cx="70" cy="60" r="7" fill="#4caf50"/>
    <path d="M25,25 L45,15 L50,35 L30,45 Z" fill="#8d6e63"/>
    <path d="M45,15 L80,50" stroke="#5d4037" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

export default ArtVolunteerIcon;