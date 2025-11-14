import React from 'react';
import type {OrganizationEvent} from '../../../lib/types';
import {MoreHorizontal, Pencil, Users} from 'lucide-react';

interface EventManagementCardProps {
  event: OrganizationEvent;
  onSelect: () => void;
  onEdit: () => void;
  onMore: (id: number) => void;
}

const EventManagementCard: React.FC<EventManagementCardProps> = ({event, onSelect, onEdit, onMore}) => {
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

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
};

export default EventManagementCard;