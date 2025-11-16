/**
 * Account statistics display component
 */

import React from 'react';

export const AccountStatistics: React.FC = () => {
  return (
    <div className="rounded-lg border border-[#443a5c] bg-[#1a1625] p-4">
      <h3 className="mb-2 font-medium text-white">Account Statistics</h3>
      <div className="space-y-1 text-sm">
        <p className="text-gray-400">
          Member since: {new Date().toLocaleDateString()}
        </p>
        <p className="text-gray-400">Total decks created: 0</p>
        <p className="text-gray-400">Cards in collection: 0</p>
      </div>
    </div>
  );
};
