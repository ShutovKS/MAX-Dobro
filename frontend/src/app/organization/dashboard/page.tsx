import React from 'react';
import {ArrowLeft, CheckCircle, Eye, List, Plus, Settings, TrendingUp, User} from 'lucide-react';

// Mock data for the dashboard
const mockStats = [
  {id: 'new_volunteers', label: 'Новых волонтеров', value: '12', Icon: User, change: '+5%'},
  {id: 'total_regs', label: 'Всего регистраций', value: '87', Icon: CheckCircle, change: '+12%'},
  {id: 'event_views', label: 'Просмотры событий', value: '1.2k', Icon: Eye, change: '-3%'},
  {id: 'response_rate', label: 'Коэффициент отклика', value: '23%', Icon: TrendingUp, change: '+1.5%'},
];

const StatCard: React.FC<{ label: string; value: string; Icon: React.FC<any>; change: string; }> = ({
                                                                                                      label,
                                                                                                      value,
                                                                                                      Icon,
                                                                                                      change
                                                                                                    }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm">
    <div className="flex justify-between items-start">
      <div className="bg-blue-100 rounded-lg p-2">
        <Icon className="w-6 h-6 text-[#007AFF]"/>
      </div>
      <span
        className={`text-sm font-semibold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</span>
    </div>
    <p className="text-3xl font-bold mt-4">{value}</p>
    <p className="text-sm text-[rgb(12,13,14,0.52)]">{label}</p>
  </div>
);

interface OrganizationDashboardPageProps {
  onSwitchToVolunteer: () => void;
  onManageEvents: () => void;
  onCreateEvent: () => void;
}

const OrganizationDashboardPage: React.FC<OrganizationDashboardPageProps> = ({
                                                                               onSwitchToVolunteer,
                                                                               onManageEvents,
                                                                               onCreateEvent
                                                                             }) => {

  return (
    <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm flex items-center justify-between">
        <button onClick={onSwitchToVolunteer}
                className="flex items-center space-x-2 text-sm font-semibold text-[#007AFF]">
          <ArrowLeft className="w-5 h-5"/>
          <span>Режим волонтера</span>
        </button>
        <h1 className="text-lg font-bold text-[#0C0D0E]">Фонд "Подари жизнь"</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Настройки организации">
          <Settings className="w-6 h-6 text-gray-700"/>
        </button>
      </header>

      <main className="flex-grow overflow-y-auto p-6 space-y-6">
        {/* Primary CTA */}
        <button onClick={onCreateEvent}
                className="w-full flex items-center justify-center space-x-2 bg-[#007AFF] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-600 transition-colors">
          <Plus className="w-6 h-6"/>
          <span>Создать новое событие</span>
        </button>

        {/* Statistics */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            {mockStats.map(stat => <StatCard key={stat.id} {...stat} />)}
          </div>
        </section>

        {/* Management */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0C0D0E]">Управление</h2>
          </div>
          <div className="space-y-3">
            <button onClick={onManageEvents}
                    className="w-full text-left bg-white rounded-2xl p-4 shadow-sm hover:bg-gray-50 transition-colors flex items-center space-x-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <List className="w-6 h-6 text-[#007AFF]"/>
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#0C0D0E]">Мои события</h4>
                <p className="text-sm text-[rgb(12,13,14,0.52)]">Просмотр и управление</p>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrganizationDashboardPage;
