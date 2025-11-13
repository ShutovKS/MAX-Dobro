import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router';
import {fetchMyChats} from '../../../lib/api';
import type {MyChatItem} from '../../../lib/types';
import {ArrowLeft, Search, X} from 'lucide-react';
import {EmptyChatIllustrationIcon} from '../../../components/ui/icons';
import EmptyState from '../../../components/ui/EmptyState';

const ChatCell: React.FC<{ chat: MyChatItem; onSelect: () => void }> = ({chat, onSelect}) => (
  <button onClick={onSelect}
          className="w-full flex items-start px-4 text-left space-x-4 hover:bg-gray-50 transition-colors">
    <div className="relative flex-shrink-0 py-3">
      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
        <chat.Icon className="w-8 h-8 text-gray-500"/>
      </div>
    </div>
    <div className="flex-1 min-w-0 border-t border-gray-100 py-3 flex flex-col justify-center">
      <div className="flex justify-between items-start">
        <p className="font-bold text-md text-[#0C0D0E] truncate pr-2">{chat.eventTitle}</p>
        <p className="text-xs text-gray-400 flex-shrink-0">{chat.timestamp}</p>
      </div>
      <div className="flex justify-between items-start mt-1">
        <p className="text-sm text-[rgb(12,13,14,0.52)] truncate pr-2">{chat.lastMessage}</p>
        {chat.unreadCount > 0 && (
          <span
            className="bg-[#007AFF] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">
                        {chat.unreadCount}
                    </span>
        )}
      </div>
    </div>
  </button>
);


const MyChatsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [loading, setLoading] = useState(true);
  const [allChats, setAllChats] = useState<MyChatItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onBack = () => navigate('/profile');
  const onSelectChat = (id: number) => navigate(`/events/${id}/chat`);
  const onFindEvent = () => navigate('/home');

  useEffect(() => {
    const loadChats = async () => {
      setLoading(true);
      const chats = await fetchMyChats();
      setAllChats(chats);
      setLoading(false);
    };
    loadChats();
  }, []);

  const filteredChats = useMemo(() => {
    const chatsForTab = allChats.filter(chat => (activeTab === 'active' ? !chat.isArchived : chat.isArchived));
    if (!searchQuery) {
      return chatsForTab;
    }
    return chatsForTab.filter(chat => chat.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allChats, activeTab, searchQuery]);

  const handleSearchToggle = () => {
    if (isSearchVisible) {
      setSearchQuery('');
    }
    setIsSearchVisible(!isSearchVisible);
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-500 p-8">Загрузка чатов...</p>;
    }
    if (filteredChats.length === 0) {
      return (
        <div className="pt-10">
          <EmptyState
            Icon={EmptyChatIllustrationIcon}
            title={searchQuery ? "Чаты не найдены" : "Здесь пока тихо"}
            subtitle={
              searchQuery
                ? "Попробуйте изменить поисковый запрос."
                : activeTab === 'active'
                  ? "Когда вы присоединитесь к событию, здесь появится чат для общения с другими волонтерами."
                  : "У вас пока нет архивных чатов."
            }
            action={activeTab === 'active' && !searchQuery ? {
              text: 'Найти событие',
              onClick: onFindEvent,
              type: 'primary',
            } : undefined
            }
          />
        </div>
      );
    }
    return (
      <div className="[&>*:first-child_>_div:last-child]:border-t-0">
        {filteredChats.map(chat => (
          <ChatCell key={chat.id} chat={chat} onSelect={() => onSelectChat(chat.eventId)}/>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-screen font-sans antialiased bg-white flex flex-col">
      <header
        className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 -ml-2"
                aria-label="Назад">
          <ArrowLeft className="w-6 h-6 text-gray-700"/>
        </button>
        {isSearchVisible ? (
          <div className="relative flex-grow flex items-center mx-2">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400"/>
                        </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Найти чат..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 text-gray-900 placeholder-gray-500 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        ) : (
          <h1 className="text-lg font-bold text-[#0C0D0E] absolute left-1/2 -translate-x-1/2">Мои чаты</h1>
        )}
        <button onClick={handleSearchToggle}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label={isSearchVisible ? "Закрыть поиск" : "Поиск"}>
          {isSearchVisible ? <X className="w-6 h-6 text-gray-700"/> : <Search className="w-6 h-6 text-gray-700"/>}
        </button>
      </header>

      {!isSearchVisible && (
        <nav className="flex-shrink-0 p-4 bg-white">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'active' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}
            >
              Активные
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'archived' ? 'bg-white shadow text-[#007AFF]' : 'text-gray-600'}`}
            >
              Архивные
            </button>
          </div>
        </nav>
      )}

      <main className="flex-grow overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default MyChatsPage;