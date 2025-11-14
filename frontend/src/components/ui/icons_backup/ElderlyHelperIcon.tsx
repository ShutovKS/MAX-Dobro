import React from 'react';
import type {IconProps} from './types';

const ElderlyHelperIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50,10 C20,10 10,40 10,60 C10,90 50,95 50,95 C50,95 90,90 90,60 C90,40 80,10 50,10 Z" fill="#ffaaa5"/>
    <path d="M50,15 C25,15 15,40 15,60 C15,85 50,90 50,90 C50,90 85,85 85,60 C85,40 75,15 50,15 Z" fill="#ff8b94"/>
    <path d="M50,30 L50,70" stroke="white" strokeWidth="6" strokeLinecap="round"/>
    <path d="M30,50 L70,50" stroke="white" strokeWidth="6" strokeLinecap="round"/>
  </svg>
);

export default ElderlyHelperIcon;