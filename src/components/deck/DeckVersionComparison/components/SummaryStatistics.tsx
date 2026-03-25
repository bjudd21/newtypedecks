/**
 * Summary statistics component showing change counts
 */

import React from 'react';

interface SummaryStatisticsProps {
  addedCount: number;
  removedCount: number;
  modifiedCount: number;
  unchangedCount: number;
}

export const SummaryStatistics: React.FC<SummaryStatisticsProps> = ({
  addedCount,
  removedCount,
  modifiedCount,
  unchangedCount,
}) => {
  return (
    <div className="bg-accent mb-6 rounded-lg p-4">
      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{addedCount}</div>
          <div className="text-muted-foreground">Added</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-600">{removedCount}</div>
          <div className="text-muted-foreground">Removed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-600">
            {modifiedCount}
          </div>
          <div className="text-muted-foreground">Modified</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground text-lg font-bold">
            {unchangedCount}
          </div>
          <div className="text-muted-foreground">Unchanged</div>
        </div>
      </div>
    </div>
  );
};
