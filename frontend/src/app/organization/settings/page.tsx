// FILE: frontend/src/app/organization/settings/page.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Organization settings for profile, notifications, and logout.
//   SCOPE: Settings rows, notification toggles, logout confirm modal
//   DEPENDS: M-FRONTEND-UI, M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   OrganizationSettingsPage - organizer settings screen
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, {useState} from 'react';
import {ArrowLeft, Bell, Briefcase, ChevronRight, FileText, LogOut, MessageSquare, Users} from 'lucide-react';
import LogoutConfirmationModal from '../../../components/ui/LogoutConfirmationModal';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({title, children}) => (
  <section>
    <h2 className="px-6 pb-2 text-sm font-semibold text-[rgb(12,13,14,0.52)] uppercase tracking-wider">{title}</h2>
    <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mx-4">
      {children}
    </div>
  </section>
);

const SettingsRow: React.FC<{
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  isDestructive?: boolean;
  info?: string
}> = ({label, Icon, onClick, isDestructive, info}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors disabled:hover:bg-transparent"
    disabled={!onClick}
  >
    <div className="flex items-center space-x-4">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDestructive ? 'bg-red-100' : 'bg-blue-100'}`}>
        <Icon className={`w-5 h-5 ${isDestructive ? 'text-[#FF303C]' : 'text-[#007AFF]'}`}/>
      </div>
      <span className={`font-semibold ${isDestructive ? 'text-[#FF303C]' : 'text-[#0C0D0E]'}`}>{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      {info && <span className="text-gray-400 text-sm">{info}</span>}
      {onClick && <ChevronRight className="w-5 h-5 text-gray-400"/>}
    </div>
  </button>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({enabled, onChange}) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-[#007AFF]' : 'bg-gray-200'}`}
    role="switch"
    aria-checked={enabled}
  >
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}/>
  </button>
);

const ToggleRow: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({
                                                                                                           label,
                                                                                                           enabled,
                                                                                                           onChange
                                                                                                         }) => (
  <div className="w-full flex items-center justify-between p-4 text-left">
    <span className="font-semibold text-[#0C0D0E]">{label}</span>
    <ToggleSwitch enabled={enabled} onChange={onChange}/>
  </div>
);


// START_CONTRACT: OrganizationSettingsPage
//   PURPOSE: Render organizer settings and confirm logout
//   INPUTS: { onBack: () => void; onLogout: () => void }
//   OUTPUTS: { ReactElement - settings lists and logout modal }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
// END_CONTRACT: OrganizationSettingsPage
const OrganizationSettingsPage: React.FC<{ onBack: () => void; onLogout: () => void; }> = ({onBack, onLogout}) => {
  const [notifications, setNotifications] = useState({newApplications: true, chatMessages: true});
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({...prev, [key]: !prev[key]}));
  }

  // START_BLOCK_RENDER_ORG_SETTINGS
  return (
    <>
      <div className="w-full h-screen font-sans antialiased bg-[#F0F0F0] flex flex-col">
        <header
          className="flex-shrink-0 p-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center">
          <button onClick={onBack}
                  className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700"/>
          </button>
          <h1 className="text-2xl font-bold text-[#0C0D0E] mx-auto">Настройки</h1>
          <div className="w-8"></div>
        </header>

        <main className="flex-grow overflow-y-auto pt-8 space-y-8 pb-8">
          <SettingsSection title="Профиль организации">
            <SettingsRow label="Редактировать профиль" Icon={Briefcase} onClick={() => {
            }}/>
            <SettingsRow label="Участники команды" Icon={Users} onClick={() => {
            }}/>
          </SettingsSection>

          <SettingsSection title="Уведомления">
            <div className="p-4 flex items-center space-x-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100">
                <Bell className="w-5 h-5 text-[#007AFF]"/>
              </div>
              <span className="font-semibold text-[#0C0D0E]">Push-уведомления</span>
            </div>
            <div className="pl-16 pr-4 py-2 border-t border-gray-100">
              <ToggleRow label="Новые заявки волонтеров" enabled={notifications.newApplications}
                         onChange={() => handleToggle('newApplications')}/>
            </div>
            <div className="pl-16 pr-4 py-2 border-t border-gray-100">
              <ToggleRow label="Сообщения в чатах событий" enabled={notifications.chatMessages}
                         onChange={() => handleToggle('chatMessages')}/>
            </div>
          </SettingsSection>

          <SettingsSection title="О платформе">
            <SettingsRow label="Написать в поддержку" Icon={MessageSquare} onClick={() => {
            }}/>
            <SettingsRow label="Политика конфиденциальности" Icon={FileText} onClick={() => {
            }}/>
          </SettingsSection>

          <div className="pt-4">
            <div className="bg-white rounded-2xl shadow-sm mx-4">
              <SettingsRow label="Выйти из аккаунта" Icon={LogOut} onClick={() => setShowLogoutConfirm(true)}
                           isDestructive/>
            </div>
          </div>
        </main>
      </div>
      <LogoutConfirmationModal
        isOpen={showLogoutConfirm}
        onConfirm={onLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
  // END_BLOCK_RENDER_ORG_SETTINGS
};

export default OrganizationSettingsPage;