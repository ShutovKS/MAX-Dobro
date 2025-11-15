import React, {useEffect, useState} from 'react';
import {List, Plus, Settings} from 'lucide-react';
import {fetchOrganizationDashboardStats, fetchOrganizationDetails,} from '../../../lib/api';
import type {OrganizationDetails, OrganizationStat, User,} from '../../../lib/types';

const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
    <div className="flex justify-between items-start">
      <div className="bg-gray-200 rounded-lg p-2 w-10 h-10"></div>
      <div className="h-4 bg-gray-200 rounded w-10 mt-1"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded w-16 mt-4"></div>
    <div className="h-4 bg-gray-200 rounded w-32 mt-1"></div>
  </div>
);

const StatCard: React.FC<{
  label: string;
  value: string;
  Icon: React.FC<any>;
  change: string;
}> = ({label, value, Icon, change}) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm">
    <div className="flex justify-between items-start">
      <div className="bg-blue-100 rounded-lg p-2">
        <Icon className="w-6 h-6 text-[#007AFF]"/>
      </div>
      <span
        className={`text-sm font-semibold ${
          change.startsWith('+') ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {change}
      </span>
    </div>
    <p className="text-3xl font-bold mt-4">{value}</p>
    <p className="text-sm text-[rgb(12,13,14,0.52)]">{label}</p>
  </div>
);

interface OrganizationDashboardPageProps {
  user: User;
  onSwitchToVolunteer: () => void;
  onManageEvents: () => void;
  onCreateEvent: () => void;
  onNavigateToSettings: () => void;
}

const OrganizationDashboardPage: React.FC<OrganizationDashboardPageProps> = ({
                                                                               user,
                                                                               onSwitchToVolunteer,
                                                                               onManageEvents,
                                                                               onCreateEvent,
                                                                               onNavigateToSettings,
                                                                             }) => {
  const [stats, setStats] = useState<OrganizationStat[]>([]);
  const [organizationDetails, setOrganizationDetails] =
    useState<OrganizationDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [statsData, orgData] = await Promise.all([
          fetchOrganizationDashboardStats(),
          fetchOrganizationDetails(),
        ]);
        setStats(statsData);
        setOrganizationDetails(orgData);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const isMockMode = true;

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      <header className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm flex items-center justify-between">
        <div className="w-10 h-10"/>
        <h1 className="text-lg font-bold text-[#0C0D0E]">
          {loading ? 'Загрузка...' : organizationDetails?.name}
        </h1>
        <button
          onClick={onNavigateToSettings}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Настройки организации"
        >
          <Settings className="w-6 h-6 text-gray-700"/>
        </button>
      </header>

      <main className="flex-grow overflow-y-auto p-6 space-y-6">
        <button
          onClick={onCreateEvent}
          className="w-full flex items-center justify-center space-x-2 bg-[#007AFF] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-6 h-6"/>
          <span>Создать новое событие</span>
        </button>

        <section>
          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              <>
                <StatCardSkeleton/>
                <StatCardSkeleton/>
                <StatCardSkeleton/>
                <StatCardSkeleton/>
              </>
            ) : (
              stats.map((stat) => <StatCard key={stat.id} {...stat} />)
            )}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0C0D0E]">Управление</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={onManageEvents}
              className="w-full text-left bg-white rounded-2xl p-4 shadow-sm hover:bg-gray-50 transition-colors flex items-center space-x-4"
            >
              <div className="bg-blue-100 rounded-lg p-3">
                <List className="w-6 h-6 text-[#0C0D0E]"/>
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#0C0D0E]">Мои события</h4>
                <p className="text-sm text-[rgb(12,13,14,0.52)]">
                  Просмотр и управление
                </p>
              </div>
            </button>
          </div>
        </section>

        {isMockMode && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <p className="text-4xl font-bold text-red-500/30 transform -rotate-12">
              ДЕМОНСТРАЦИОННЫЙ
            </p>
            <p className="text-3xl font-semibold text-red-500/30 transform -rotate-12">
              ВАРИАНТ
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrganizationDashboardPage;