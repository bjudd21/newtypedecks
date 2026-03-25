/**
 * Empty state component when no versions exist
 */

import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-muted-foreground py-8 text-center">
      <div className="text-lg font-medium">No versions yet</div>
      <div className="mt-1 text-sm">
        Versions are created automatically when you make changes to your deck.
      </div>
    </div>
  );
};
