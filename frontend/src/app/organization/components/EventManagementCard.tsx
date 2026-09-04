// FILE: frontend/src/app/organization/components/EventManagementCard.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Card for an organizer event with edit, more, and participant actions.
//   SCOPE: Event summary, draft badge, participant counts, action buttons
//   DEPENDS: M-FRONTEND-UI, M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EventManagementCard - organizer event management row card
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import type {OrganizationEvent} from '../../../lib/types';
import {MoreHorizontal, Pencil, Users} from 'lucide-react';

interface EventManagementCardProps {
  event: OrganizationEvent;
  onSelect: () => void;
  onEdit: () => void;
  onMore: (id: number) => void;
}

// START_CONTRACT: EventManagementCard
//   PURPOSE: Render one organizer event with edit and more actions
//   INPUTS: { event: OrganizationEvent; onSelect/onEdit/onMore: callbacks }
//   OUTPUTS: { ReactElement - event management card }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-SCREENS, V-M-FRONTEND-SCREENS
// END_CONTRACT: EventManagementCard
const EventManagementCard: React.FC<EventManagementCardProps> = ({event, onSelect, onEdit, onMore}) => {
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  // START_BLOCK_RENDER_CARD
  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-white rounded-2xl p-4 shadow-sm hover:bg-gray-50 transition-colors"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-[#0C0D0E]">{event.title}</h3>
          <p className="text-sm text-[rgb(12,13,14,0.52)] mt-1">{event.date}</p>
        </div>
        {event.status === 'draft' && (
          <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-3 py-1 rounded-full">Черновик</span>
        )}
      </div>

      {event.status !== 'draft' && (
        <div className="flex items-center space-x-2 text-sm text-[rgb(12,13,14,0.52)] mb-4">
          <Users className="w-5 h-5"/>
          <span className="font-semibold text-[#0C0D0E]">{event.participantCount} / {event.capacity}</span>
          <span>участников</span>
          {event.newApplications > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                <span className="font-semibold text-yellow-600">{event.newApplications} новых</span>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 border-t border-gray-100 pt-3 mt-3">
        <button
          onClick={(e) => handleButtonClick(e, () => onMore(event.id))}
          className="p-2 rounded-lg hover:bg-gray-200"
        >
          <MoreHorizontal className="w-6 h-6 text-gray-600"/>
        </button>
        <button
          onClick={(e) => handleButtonClick(e, onEdit)}
          className="flex items-center space-x-2 font-semibold py-2 px-4 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
        >
          <Pencil className="w-5 h-5"/>
          <span>{event.status === 'draft' ? 'Завершить' : 'Редактировать'}</span>
        </button>
      </div>
    </button>
  );
  // END_BLOCK_RENDER_CARD
};

export default EventManagementCard;