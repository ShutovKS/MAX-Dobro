// FILE: frontend/src/app/stories/create/SelectEventModal.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Modal to pick a past event when composing a story.
//   SCOPE: Load past history events, search, and select
//   DEPENDS: M-FRONTEND-API, M-FRONTEND-UI, M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   SelectEventModal - past-event picker for story creation
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React, {useEffect, useState} from 'react';
import {fetchActivityHistoryEvents} from '../../../lib/api';
import type {HistoryEvent} from '../../../lib/types';
import {Search, X} from 'lucide-react';

// START_CONTRACT: SelectEventModal
//   PURPOSE: Load past events and let the user pick one for a new story
//   INPUTS: { isOpen: boolean; onClose: () => void; onSelect: (event: HistoryEvent) => void }
//   OUTPUTS: { ReactElement - bottom-sheet event list }
//   SIDE_EFFECTS: fetchActivityHistoryEvents when opened
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS, fn-fetchActivityHistoryEvents
// END_CONTRACT: SelectEventModal
const SelectEventModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (event: HistoryEvent) => void;
}> = ({isOpen, onClose, onSelect}) => {
  const [pastEvents, setPastEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // START_BLOCK_LOAD_PAST_EVENTS
  useEffect(() => {
    if (isOpen) {
      const loadEvents = async () => {
        setLoading(true);
        const all = await fetchActivityHistoryEvents();
        setPastEvents(all.filter(e => e.status === 'past'));
        setLoading(false);
      };
      loadEvents();
    }
  }, [isOpen]);
  // END_BLOCK_LOAD_PAST_EVENTS

  const filteredEvents = pastEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // START_BLOCK_RENDER_EVENT_LIST
  return (
    <div
      className={`fixed inset-0 z-[60] transition-colors duration-300 ${isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{height: '75vh'}}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="w-12"></div>
          <h2 className="text-xl font-bold text-[#0C0D0E]">Выбрать событие</h2>
          <button onClick={onClose}
                  className="w-12 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800"
                  aria-label="Закрыть">
            <X className="w-6 h-6"/>
          </button>
        </header>

        <div className="p-4 flex-shrink-0">
          <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400"/>
                        </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Найти событие по названию"
              className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-500 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <main className="flex-grow overflow-y-auto px-4">
          <div className="divide-y divide-gray-100">
            {loading ? (
              <p className="text-center text-gray-500 p-4">Загрузка...</p>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <button
                  key={event.id}
                  onClick={() => onSelect(event)}
                  className="w-full flex items-center py-3 text-left space-x-4 hover:bg-gray-50 rounded-lg p-2"
                >
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center">
                    <event.Icon className="w-8 h-8 text-gray-500"/>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#0C0D0E]">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-center text-gray-500 p-4">Прошедшие события не найдены.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
  // END_BLOCK_RENDER_EVENT_LIST
};

export default SelectEventModal;