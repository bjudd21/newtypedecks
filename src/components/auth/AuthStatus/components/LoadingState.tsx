/**
 * Loading state component
 */

import React from 'react';

interface LoadingStateProps {
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  className = '',
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-accent h-8 w-20 rounded"></div>
    </div>
  );
};
