/**
 * SystemStatusCard - System health and status display
 */

import React from 'react';

export const SystemStatusCard: React.FC = () => {
  return (
    <div className="border-border bg-card/60 overflow-hidden rounded-lg border p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center">
        <span className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl shadow-lg">
          📊
        </span>
        <h3 className="text-lg font-semibold text-white">System Status</h3>
      </div>
      <p className="text-foreground mb-4">
        Monitor system health and performance metrics.
      </p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Database Status:</span>
          <span className="font-medium text-green-400">Online</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Import Service:</span>
          <span className="font-medium text-green-400">Active</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">File Storage:</span>
          <span className="font-medium text-green-400">Available</span>
        </div>
      </div>
    </div>
  );
};
