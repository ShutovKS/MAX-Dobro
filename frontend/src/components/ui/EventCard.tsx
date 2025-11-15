import React from 'react';
import type {AppEvent} from '../../lib/types';

const EventCard: React.FC<{ event: AppEvent }> = React.memo(({event}) => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 w-full">
    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center">
      <event.Icon className="w-12 h-12"/>
    </div>
    <div className="text-left">
      <h3 className="font-bold text-md text-text-primary">{event.title}</h3>
      <p className="text-sm text-gray-500">{event.category}</p>
      <p className="text-xs text-gray-400 mt-1">{event.date} &middot; {event.location}</p>
    </div>
  </div>
));

export default EventCard;
