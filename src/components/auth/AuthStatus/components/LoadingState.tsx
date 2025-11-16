/**
 * Loading state component
 */

import React from 'react';

interface LoadingStateProps {
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-8 w-20 rounded bg-[#3a3050]"></div>
    </div>
  );
};
