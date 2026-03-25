/**
 * Loading state component
 */

import React from 'react';

interface LoadingStateProps {
  cardName: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ cardName }) => {
  return (
    <div
      className="bg-muted absolute inset-0 flex items-center justify-center"
      role="status"
      aria-label={`Loading ${cardName} card image`}
      aria-live="polite"
    >
      <div className="animate-pulse">
        <div className="bg-muted h-8 w-8 rounded"></div>
      </div>
    </div>
  );
};
