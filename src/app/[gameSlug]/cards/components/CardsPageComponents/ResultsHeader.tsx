import React from 'react';
import { PaginationModeSelector } from './PaginationModeSelector';
import { SortControls } from './SortControls';
import type { PaginationMode } from './types';

interface ResultsHeaderProps {
  total: number;
  paginationMode: PaginationMode;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onPaginationModeChange: (mode: PaginationMode) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export function ResultsHeader({
  total,
  paginationMode,
  sortBy,
  sortOrder,
  onPaginationModeChange,
  onSortChange,
}: ResultsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-900">Search Results</h2>
        {total > 0 && (
          <span className="text-sm text-gray-500">
            ({total.toLocaleString()} cards found)
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <PaginationModeSelector
          mode={paginationMode}
          onChange={onPaginationModeChange}
        />
        <SortControls
          sortBy={sortBy}
          sortOrder={sortOrder}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
}
