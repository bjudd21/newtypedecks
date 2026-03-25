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
    <div className="rounded border border-orange-500/30 bg-orange-900/20 p-3">
      <div className="mb-1 font-medium text-orange-900">📡 Offline Mode</div>
      <div className="mb-2 text-sm text-orange-400">
        You&apos;re currently offline. Your changes will sync automatically when
        you&apos;re back online.
      </div>
      {pendingSync > 0 && (
        <div className="text-xs text-orange-400">
          {pendingSync} items waiting to sync
        </div>
      )}
    </div>
  );
};
