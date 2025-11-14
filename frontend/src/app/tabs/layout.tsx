import React from 'react';
import {useNavigate} from 'react-router';
import TabBar from '../../components/layout/TabBar';
import HomePage from './page';
import CoursesPage from './courses/page';
import OrganizationsPage from './organizations/page';
import ProfilePage from './profile/page';
import StoriesPage from './stories/page';
import type {Tab, User} from '../../lib/types';

interface TabsLayoutProps {
  user: User;
  activeTab: Tab;
  onSwitchToOrganizationMode: () => void;
}

const TabsLayout: React.FC<TabsLayoutProps> = ({
                                                 user, activeTab, onSwitchToOrganizationMode
                                               }) => {
  const navigate = useNavigate();

  const handleTabChange = (tab: Tab) => {
    navigate(`/${tab}`);
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage/>;
      case 'training':
        return <CoursesPage/>;
      case 'organizations':
        return <OrganizationsPage/>;
      case 'stories':
        return <StoriesPage/>;
      case 'profile':
        return <ProfilePage user={user} onSwitchToOrganizationMode={onSwitchToOrganizationMode}/>;
      default:
        return <HomePage/>;
    }
  };

  return (
    <div className="w-full h-screen font-sans antialiased relative overflow-hidden bg-[#F0F0F0]">
      <div className="w-full h-full overflow-y-auto pb-20">
        {renderContent()}
      </div>
      <TabBar activeTab={activeTab} onTabChange={handleTabChange}/>
    </div>
  );
};

export default TabsLayout;