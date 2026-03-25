/**
 * List of offline features
 */

import React from 'react';

export const OfflineFeatures: React.FC = () => {
  return (
    <div className="border-t pt-4">
      <h4 className="mb-2 font-medium text-gray-900">📱 Offline Features</h4>
      <div className="text-muted-foreground space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span>Browse cached cards and decks</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span>Create and edit decks offline</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span>Auto-sync when back online</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span>Collection management</span>
        </div>
      </div>
    </div>
  );
};
