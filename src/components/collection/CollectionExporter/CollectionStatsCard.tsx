/**
 * CollectionStatsCard Component
 * Displays collection statistics summary
 */

import React from 'react';

interface CollectionStatsCardProps {
  totalCards: number;
  uniqueCards: number;
  totalValue?: number;
}

export const CollectionStatsCard: React.FC<CollectionStatsCardProps> = ({
  totalCards,
  uniqueCards,
  totalValue,
}) => {
  return (
    <div className="rounded-lg border border-[#443a5c] bg-[#1a1625] p-4">
      <div className="mb-2 text-sm font-medium text-[#8b7aaa]">
        Collection Summary
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
        <div>
          <div className="font-semibold text-white">{totalCards}</div>
          <div className="text-gray-400">Total Cards</div>
        </div>
        <div>
          <div className="font-semibold text-white">{uniqueCards}</div>
          <div className="text-gray-400">Unique Cards</div>
        </div>
        {totalValue && (
          <div>
            <div className="font-semibold text-white">
              ${totalValue.toFixed(2)}
            </div>
            <div className="text-gray-400">Total Value</div>
          </div>
        )}
      </div>
    </div>
  );
};
