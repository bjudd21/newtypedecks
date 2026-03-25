/**
 * Loading state component
 */

import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="py-8 text-center">
      <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
      <p className="text-muted-foreground mt-2">Loading collection...</p>
    </div>
  );
};
