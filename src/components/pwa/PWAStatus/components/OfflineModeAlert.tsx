/**
 * Offline mode alert component
 */

import React from 'react';

interface OfflineModeAlertProps {
  pendingSync: number;
}

export const OfflineModeAlert: React.FC<OfflineModeAlertProps> = ({
  pendingSync,
}) => {
  return (
    <div className="rounded border border-orange-200 bg-orange-50 p-3">
      <div className="mb-1 font-medium text-orange-900">📡 Offline Mode</div>
      <div className="mb-2 text-sm text-orange-700">
        You&apos;re currently offline. Your changes will sync automatically
        when you&apos;re back online.
      </div>
      {pendingSync > 0 && (
        <div className="text-xs text-orange-600">
          {pendingSync} items waiting to sync
        </div>
      )}
    </div>
  );
};
