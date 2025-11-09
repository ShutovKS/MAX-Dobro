import React from 'react';

const StorySkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm p-4 animate-pulse w-full max-w-lg mx-auto">
    <div className="flex items-center mb-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="ml-3 flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="w-full h-64 bg-gray-200 rounded-lg mb-3"></div>
    <div className="flex justify-between items-center">
      <div className="flex space-x-4">
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 w-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default StorySkeletonCard;