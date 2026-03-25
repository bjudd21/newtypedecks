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
      <div className="bg-muted h-3 w-3 animate-pulse rounded-full"></div>
      <span className="text-muted-foreground text-sm">Loading...</span>
    </div>
  );
};
