import React, {useEffect, useMemo, useState} from 'react';
import type {AppEvent, Friend} from '../../../lib/types';
import {fetchFriends} from '../../../lib/api';
import {Calendar, List, Search, X} from 'lucide-react';
import {MODAL_TRANSITION_DURATION} from '../../../lib/constants';

const CheckboxIcon: React.FC<{ checked: boolean }> = ({checked}) => {
  if (checked) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
           className="w-7 h-7 text-brand">
        <path fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"/>
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
         className="w-7 h-7 text-gray-300">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  );
};


const InviteFriendModal: React.FC<{
  isOpen: boolean;
  event: AppEvent;
  onClose: () => void;
  onSend: () => void;
}> = ({isOpen, event, onClose, onSend}) => {
  const [allFriends, setAllFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchFriends().then(setAllFriends);
    } else {
      setTimeout(() => {
        setSearchQuery('');
        setSelectedFriends([]);
      }, MODAL_TRANSITION_DURATION);
    }
  }, [isOpen]);

  const filteredFriends = useMemo(() => {
    if (!searchQuery) return allFriends;
    return allFriends.filter(friend => friend.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, allFriends]);

  const toggleFriend = (id: number) => {
    setSelectedFriends(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    if (selectedFriends.length > 0) {
      onSend();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-friend-title"
    >
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{height: '85vh'}}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="w-12"></div>
          <div className="text-center">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-2"></div>
            <h2 id="invite-friend-title" className="text-xl font-bold text-text-primary">Пригласить друзей</h2>
          </div>
          <button onClick={onClose}
                  className="w-12 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800"
                  aria-label="Закрыть">
            <X className="w-6 h-6"/>
          </button>
        </header>

        <div className="p-6 pb-2 flex-shrink-0">
          <div className="bg-gray-50 p-3 rounded-xl mb-4">
            <div className="flex items-center space-x-3">
              <List className="w-5 h-5 text-gray-500 flex-shrink-0"/>
              <span className="font-semibold text-sm text-text-primary truncate">{event.title}</span>
            </div>
            <div className="flex items-center space-x-3 mt-1.5">
              <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0"/>
              <span className="text-sm text-gray-700">{event.date}</span>
            </div>
          </div>

          <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400"/>
                        </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Найти друга по имени"
              className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <main className="flex-grow overflow-y-auto px-6">
          <div className="divide-y divide-gray-100">
            {filteredFriends.map(friend => (
              <button
                key={friend.id}
                onClick={() => toggleFriend(friend.id)}
                className="w-full flex items-center py-3 text-left"
              >
                <img loading="lazy" src={friend.avatarUrl} alt={friend.name} className="w-12 h-12 rounded-full"/>
                <span className="flex-1 ml-4 font-semibold text-text-primary">{friend.name}</span>
                <CheckboxIcon checked={selectedFriends.includes(friend.id)}/>
              </button>
            ))}
          </div>
        </main>

        <footer className="p-4 border-t border-gray-100 flex-shrink-0 bg-white">
          <button
            onClick={handleSend}
            disabled={selectedFriends.length === 0}
            className="w-full text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed bg-brand hover:bg-brand-dark"
          >
            {selectedFriends.length > 0 ? `Отправить (${selectedFriends.length})` : 'Отправить'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default InviteFriendModal;

