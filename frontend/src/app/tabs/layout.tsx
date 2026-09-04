import React from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router';
import TabBar from '../../components/layout/TabBar';
import type {Tab, User} from '../../lib/types';

interface TabsLayoutProps {
  user: User;
  onSwitchToOrganizationMode: () => void;
}

const TabsLayout: React.FC<TabsLayoutProps> = ({
                                                 user, onSwitchToOrganizationMode
}) => {
  /** <context:frontend_tabs_layout> Shared tab scaffold for the main app navigation. </context:frontend_tabs_layout> */
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

  return (
    <div className="w-full h-screen font-sans antialiased relative overflow-hidden bg-[#F0F0F0]">
      <div className="w-full h-full overflow-y-auto pb-20">
        <Outlet context={{user, onSwitchToOrganizationMode}}/>
      </div>
      <TabBar activeTab={getActiveTab()} onTabChange={handleTabChange}/>
    </div>
  );
};

export default TabsLayout;
