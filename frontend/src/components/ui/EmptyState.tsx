// FILE: frontend/src/components/ui/EmptyState.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Empty-list placeholder with optional call to action.
//   SCOPE: Render illustration, title, subtitle, and primary or secondary action
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   EmptyState - centered empty-state illustration and optional action button
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';

interface EmptyStateProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
  action?: {
    text: string;
    onClick: () => void;
    type: 'primary' | 'secondary';
  };
}

// START_CONTRACT: EmptyState
//   PURPOSE: Render an empty-state illustration and optional action
//   INPUTS: { Icon: SVG component; title: string; subtitle: string; action?: { text, onClick, type } }
//   OUTPUTS: { ReactElement - empty-state layout }
//   SIDE_EFFECTS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
// END_CONTRACT: EmptyState
const EmptyState: React.FC<EmptyStateProps> = ({Icon, title, subtitle, action}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full">
      <Icon className="w-40 h-40 text-gray-300 mb-6"/>
      <h3 className="font-bold text-xl text-[#0C0D0E]">{title}</h3>
      <p className="text-[rgb(12,13,14,0.52)] max-w-xs mt-1 mb-6">{subtitle}</p>
      {action && (
        action.type === 'primary' ? (
          <button
            onClick={action.onClick}
            className="bg-[linear-gradient(157deg,#08D7F3_6.38%,#5398FF_85%)] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
          >
            {action.text}
          </button>
        ) : (
          <button
            onClick={action.onClick}
            className="bg-transparent border-2 border-[#007AFF] text-[#007AFF] font-semibold py-2 px-5 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            {action.text}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
