// FILE: frontend/src/components/ui/EventCard.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Event summary card used in volunteer feeds.
//   SCOPE: Render event thumbnail or icon, title, category, date, and location
//   DEPENDS: M-FRONTEND-TYPES
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EventCard - compact event summary card
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import type {AppEvent} from '../../lib/types';
import {iconMap} from '../../lib/iconMap';

// START_CONTRACT: EventCard
//   PURPOSE: Render an event summary card
//   INPUTS: { event: AppEvent - event to display }
//   OUTPUTS: { ReactElement - card UI }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI, export-EventCard
// END_CONTRACT: EventCard
const EventCard: React.FC<{ event: AppEvent }> = React.memo(({event}) => {
  const IconComponent = iconMap[event.icon] || React.Fragment;
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 w-full">
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
        {event.imageUrl ? (
          <img loading="lazy" src={event.imageUrl} alt={event.title}
               className="w-full h-full object-cover"/>
        ) : (
          <IconComponent className="w-12 h-12"/>
        )}
      </div>
      <div className="text-left">
        <h3 className="font-bold text-md text-[#0C0D0E]">{event.title}</h3>
        <p className="text-sm text-gray-500">{event.category}</p>
        <p className="text-xs text-gray-400 mt-1">{event.date} &middot; {event.location}</p>
      </div>
    </div>
  );
});

export default EventCard;
