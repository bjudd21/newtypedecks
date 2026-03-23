/**
 * Sort controls component
 */

import React from 'react';
import type { CardSortField } from '@/lib/types/card';

interface SortControlsProps {
  sortBy: CardSortField;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: CardSortField, sortOrder: 'asc' | 'desc') => void;
  totalResults: number;
}

export const SortControls: React.FC<SortControlsProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  totalResults,
}) => {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium text-gray-400">Sort by:</span>
        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split(':');
            onSortChange(field as CardSortField, order as 'asc' | 'desc');
          }}
          className="h-8 rounded-md border-[#443a5c] bg-[#2d2640] px-3 text-sm text-white focus:border-[#6b5a8a] focus:ring-[#6b5a8a]/30 focus:outline-none"
        >
          <option value="name:asc">Name (A-Z)</option>
          <option value="cost:asc">Cost (Low to High)</option>
          <option value="level:asc">Level (Low to High)</option>
          <option value="attack:desc">Attack (High to Low)</option>
          <option value="createdAt:desc">Recently Added</option>
        </select>
      </div>

      {totalResults > 0 && (
        <div className="text-sm font-medium">
          <span className="text-white">{totalResults}</span>
          <span className="ml-1 text-gray-400">cards found</span>
        </div>
      )}
    </div>
  );
};
