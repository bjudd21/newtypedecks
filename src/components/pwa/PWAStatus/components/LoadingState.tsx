/**
 * Loading state component
 */

import React from 'react';

interface LoadingStateProps {
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-3 w-3 animate-pulse rounded-full bg-gray-300"></div>
      <span className="text-sm text-gray-600">Loading...</span>
    </div>
  );
};
