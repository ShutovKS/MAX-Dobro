import React from 'react';
import {ChatBubbleLeftRightIcon, HomeIcon, OrganizationsIcon, ProfileIcon, TrainingIcon} from '../ui/icons';
import type {Tab} from '../../lib/types';

const TabBar: React.FC<{ activeTab: Tab; onTabChange: (tab: Tab) => void; }> = React.memo(({
                                                                                             activeTab,
                                                                                             onTabChange
                                                                                           }) => {
  const navItems = [
    {id: 'home', label: 'Главная', Icon: HomeIcon},
    {id: 'training', label: 'Обучение', Icon: TrainingIcon},
    {id: 'organizations', label: 'Организации', Icon: OrganizationsIcon},
    {id: 'stories', label: 'Истории', Icon: ChatBubbleLeftRightIcon},
    {id: 'profile', label: 'Профиль', Icon: ProfileIcon},
  ];
  return (
    <footer
      className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-40 rounded-t-2xl">
      <nav className="flex justify-around items-center h-20">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as Tab)}
            className={`flex flex-col items-center transition-colors w-1/5 ${activeTab === item.id ? 'text-[#007AFF]' : 'text-[rgb(12,13,14,0.52)]'}`}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            <item.Icon className="w-7 h-7"/>
            <span className="text-xs font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
});

export default TabBar;