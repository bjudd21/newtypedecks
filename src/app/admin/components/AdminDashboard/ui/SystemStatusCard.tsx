/**
 * SystemStatusCard - System health and status display
 */

import React from 'react';

export const SystemStatusCard: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-lg border border-[#443a5c] bg-[#2d2640]/60 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center">
        <span className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl shadow-lg">
          📊
        </span>
        <h3 className="text-lg font-semibold text-white">System Status</h3>
      </div>
      <p className="mb-4 text-gray-300">
        Monitor system health and performance metrics.
      </p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Database Status:</span>
          <span className="font-medium text-green-400">Online</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Import Service:</span>
          <span className="font-medium text-green-400">Active</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">File Storage:</span>
          <span className="font-medium text-green-400">Available</span>
        </div>
      </div>
    </div>
  );
};
