/**
 * Simple primary sort selector component
 */

import React from 'react';
import type { SortOption, ActiveSort } from '../types';

interface SimpleSortSelectorProps {
  sortOptions: SortOption[];
  primarySort: ActiveSort | undefined;
  showMultiSort: boolean;
  onClearAllSorts: () => void;
  onAddSort: (field: string, order: 'asc' | 'desc') => void;
  onSortsChange: (sorts: ActiveSort[]) => void;
}

export const SimpleSortSelector: React.FC<SimpleSortSelectorProps> = ({
  sortOptions,
  primarySort,
  showMultiSort,
  onClearAllSorts,
  onAddSort,
  onSortsChange,
}) => {
  return (
    <select
      value={primarySort ? `${primarySort.field}:${primarySort.order}` : ''}
      onChange={(e) => {
        if (!e.target.value) {
          onClearAllSorts();
          return;
        }

        const [field, order] = e.target.value.split(':');
        if (!showMultiSort) {
          // Single sort mode - replace all sorts
          onSortsChange([
            { field, order: order as 'asc' | 'desc', priority: 1 },
          ]);
        } else {
          // Multi sort mode - add/update primary sort
          onAddSort(field, order as 'asc' | 'desc');
        }
      }}
      className="border-border min-w-0 rounded border px-2 py-1 text-sm"
    >
      <option value="">Default</option>
      {sortOptions.map((option) => (
        <React.Fragment key={option.key}>
          <option value={`${option.key}:${option.defaultOrder || 'asc'}`}>
            {option.label} (
            {option.defaultOrder === 'desc' ? 'High-Low' : 'A-Z'})
          </option>
          <option
            value={`${option.key}:${option.defaultOrder === 'desc' ? 'asc' : 'desc'}`}
          >
            {option.label} (
            {option.defaultOrder === 'desc' ? 'Low-High' : 'Z-A'})
          </option>
        </React.Fragment>
      ))}
    </select>
  );
};
