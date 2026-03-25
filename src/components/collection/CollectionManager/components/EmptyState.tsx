/**
 * Empty state component
 */

import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-muted-foreground py-8 text-center">
      <p>No cards found in your collection.</p>
      <p className="mt-1 text-sm">
        Start adding cards to build your collection!
      </p>
    </div>
  );
};
