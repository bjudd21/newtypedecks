/**
 * Summary statistics component showing change counts
 */

import React from 'react';
import type { CardChange } from '../types';

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
    <div className="mb-6 rounded-lg bg-gray-50 p-4">
      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{addedCount}</div>
          <div className="text-gray-600">Added</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-600">{removedCount}</div>
          <div className="text-gray-600">Removed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-600">
            {modifiedCount}
          </div>
          <div className="text-gray-600">Modified</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-600">
            {unchangedCount}
          </div>
          <div className="text-gray-600">Unchanged</div>
        </div>
      </div>
    </div>
  );
};
