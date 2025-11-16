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
      className="absolute inset-0 flex items-center justify-center bg-gray-100"
      role="status"
      aria-label={`Loading ${cardName} card image`}
      aria-live="polite"
    >
      <div className="animate-pulse">
        <div className="h-8 w-8 rounded bg-gray-200"></div>
      </div>
    </div>
  );
};
