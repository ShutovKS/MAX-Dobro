// FILE: frontend/src/components/layout/TabBar.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Primary volunteer tab navigation footer.
//   SCOPE: Render home, training, organizations, stories, and profile tabs
//   DEPENDS: M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   TabBar - bottom tab bar that reports the selected volunteer tab
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import {BookOpen, Home, MessageSquare, User, Users} from 'lucide-react';
import type {Tab} from '../../lib/types';

// START_CONTRACT: TabBar
//   PURPOSE: Render primary volunteer tab navigation
//   INPUTS: { activeTab: Tab - currently selected tab; onTabChange: (tab: Tab) => void - tab select handler }
//   OUTPUTS: { ReactElement - footer nav }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: TabBar
const TabBar: React.FC<{ activeTab: Tab; onTabChange: (tab: Tab) => void; }> = React.memo(({
                                                                                             activeTab,
                                                                                             onTabChange
                                                                                           }) => {
  const navItems = [
    {id: 'home', label: 'Главная', Icon: Home},
    {id: 'training', label: 'Обучение', Icon: BookOpen},
    {id: 'organizations', label: 'Организации', Icon: Users},
    {id: 'stories', label: 'Истории', Icon: MessageSquare},
    {id: 'profile', label: 'Профиль', Icon: User},
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
