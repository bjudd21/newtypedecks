/**
 * Account statistics display component
 */

import React from 'react';

export const AccountStatistics: React.FC = () => {
  return (
    <div className="border-border bg-background rounded-lg border p-4">
      <h3 className="text-foreground mb-2 font-medium">Account Statistics</h3>
      <div className="space-y-1 text-sm">
        <p className="text-muted-foreground">
          Member since: {new Date().toLocaleDateString()}
        </p>
        <p className="text-muted-foreground">Total decks created: 0</p>
        <p className="text-muted-foreground">Cards in collection: 0</p>
      </div>
    </div>
  );
};
