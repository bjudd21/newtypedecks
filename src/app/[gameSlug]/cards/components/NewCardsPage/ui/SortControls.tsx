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
        <span className="text-muted-foreground font-medium">Sort by:</span>
        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split(':');
            onSortChange(field as CardSortField, order as 'asc' | 'desc');
          }}
          className="border-border bg-card focus:border-primary focus:ring-primary/30 text-foreground h-8 rounded-md px-3 text-sm focus:outline-none"
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
          <span className="text-foreground">{totalResults}</span>
          <span className="text-muted-foreground ml-1">cards found</span>
        </div>
      )}
    </div>
  );
};
