/**
 * Empty state component
 */

import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="border-border bg-card/60 rounded-lg border p-12 text-center backdrop-blur-md">
      <p className="text-muted-foreground">No cards found</p>
      <p className="text-muted-foreground/70 mt-2 text-sm">
        Create your first card to get started
      </p>
    </div>
  );
};
