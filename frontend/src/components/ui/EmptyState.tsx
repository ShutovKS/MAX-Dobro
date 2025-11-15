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

const EmptyState: React.FC<EmptyStateProps> = ({Icon, title, subtitle, action}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full">
      <Icon className="w-40 h-40 text-gray-300 mb-6"/>
      <h3 className="font-bold text-xl text-text-primary">{title}</h3>
      <p className="text-text-secondary max-w-xs mt-1 mb-6">{subtitle}</p>
      {action && (
        action.type === 'primary' ? (
          <button
            onClick={action.onClick}
            className="bg-gradient-primary text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
          >
            {action.text}
          </button>
        ) : (
          <button
            onClick={action.onClick}
            className="bg-transparent border-2 border-brand text-brand font-semibold py-2 px-5 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            {action.text}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
