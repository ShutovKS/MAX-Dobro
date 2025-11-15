import React from 'react';
import {HeartHandIcon} from '../../components/ui/icons';

const SplashPage: React.FC = () => {
  return (
    <div className="bg-white w-full h-screen flex items-center justify-center font-sans antialiased">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <HeartHandIcon className="w-28 h-28 text-[#007AFF]"/>
        <h1 className="text-5xl font-bold tracking-tight text-[#0C0D0E]">
          MAX<span className="text-[#007AFF]">Добро</span>
        </h1>
        <p className="text-sm font-medium tracking-[0.2em] text-[rgba(12,13,14,0.52)] uppercase">
          Платформа для волонтёров
        </p>
      </div>
    </div>
  );
};

export default SplashPage;
