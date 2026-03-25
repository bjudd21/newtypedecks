/**
 * Loading state component for public deck browser
 */

import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      <p className="text-muted-foreground">Loading community decks...</p>
    </div>
  );
};
