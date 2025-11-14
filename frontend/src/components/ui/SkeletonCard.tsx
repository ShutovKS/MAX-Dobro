import React from 'react';

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 animate-pulse">
    <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
    <div className="flex-1 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

export default SkeletonCard;
