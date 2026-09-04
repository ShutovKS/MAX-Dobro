// FILE: frontend/src/app/tabs/layout.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Shared tab scaffold for volunteer home, training, orgs, stories, and profile.
//   SCOPE: Active-tab resolution from the path, tab navigation, Outlet context
//   DEPENDS: M-FRONTEND-UI, M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   TabsLayout - tab scaffold wrapping Outlet and TabBar
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router';
import TabBar from '../../components/layout/TabBar';
import type {Tab, User} from '../../lib/types';

interface TabsLayoutProps {
  user: User;
  onSwitchToOrganizationMode: () => void;
}

// START_CONTRACT: TabsLayout
//   PURPOSE: Wrap tab screens with TabBar and pass user context through Outlet
//   INPUTS: { user: User; onSwitchToOrganizationMode: () => void }
//   OUTPUTS: { ReactElement - scrollable outlet plus sticky tab bar }
//   SIDE_EFFECTS: Navigates between /app tab routes
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
// END_CONTRACT: TabsLayout
const TabsLayout: React.FC<TabsLayoutProps> = ({
                                                 user, onSwitchToOrganizationMode
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = (): Tab => {
    const pathParts = location.pathname.split('/');
    const tabPart = pathParts[2] as Tab;
    const validTabs: Tab[] = ['home', 'training', 'organizations', 'stories', 'profile'];
    return validTabs.includes(tabPart) ? tabPart : 'home';
  };

  const handleTabChange = (tab: Tab) => {
    navigate(`/app/${tab}`);
  }

  // START_BLOCK_RENDER_TABS
  return (
    <div className="w-full h-screen font-sans antialiased relative overflow-hidden bg-[#F0F0F0]">
      <div className="w-full h-full overflow-y-auto pb-20">
        <Outlet context={{user, onSwitchToOrganizationMode}}/>
      </div>
      <TabBar activeTab={getActiveTab()} onTabChange={handleTabChange}/>
    </div>
  );
  // END_BLOCK_RENDER_TABS
};

export default TabsLayout;
