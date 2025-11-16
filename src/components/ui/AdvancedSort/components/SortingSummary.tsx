/**
 * Summary of active sorts when collapsed
 */

import React from 'react';
import type { ActiveSort, SortOption } from '../types';

interface SortingSummaryProps {
  activeSorts: ActiveSort[];
  sortOptions: SortOption[];
}

export const SortingSummary: React.FC<SortingSummaryProps> = ({
  activeSorts,
  sortOptions,
}) => {
  if (activeSorts.length === 0) {
    return null;
  }

  return (
    <div className="text-xs text-gray-500">
      Sorting by:{' '}
      {activeSorts
        .sort((a, b) => a.priority - b.priority)
        .map((sort, index) => {
          const option = sortOptions.find((opt) => opt.key === sort.field);
          return `${index > 0 ? ', then ' : ''}${option?.label || sort.field} ${sort.order === 'asc' ? '↑' : '↓'}`;
        })
        .join('')}
    </div>
  );
};
