/**
 * List of active sorts component
 */

import React from 'react';
import { Button } from '@/components/ui';
import type { ActiveSort, SortOption } from '../types';

interface ActiveSortsListProps {
  activeSorts: ActiveSort[];
  sortOptions: SortOption[];
  onAddSort: (field: string, order: 'asc' | 'desc') => void;
  onRemoveSort: (field: string) => void;
}

export const ActiveSortsList: React.FC<ActiveSortsListProps> = ({
  activeSorts,
  sortOptions,
  onAddSort,
  onRemoveSort,
}) => {
  if (activeSorts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-muted-foreground mb-2 text-xs font-medium">
        Active Sorts:
      </div>
      {activeSorts
        .sort((a, b) => a.priority - b.priority)
        .map((sort, index) => {
          const option = sortOptions.find((opt) => opt.key === sort.field);
          return (
            <div
              key={sort.field}
              className="bg-card flex items-center gap-2 rounded border px-3 py-2"
            >
              <div className="text-muted-foreground/70 flex items-center gap-1 text-xs">
                <span className="font-medium">{index + 1}.</span>
              </div>
              <div className="flex-1 text-sm">
                {option?.label || sort.field}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  onClick={() =>
                    onAddSort(sort.field, sort.order === 'asc' ? 'desc' : 'asc')
                  }
                  variant="outline"
                  size="sm"
                  className="px-2 py-1 text-xs"
                >
                  {sort.order === 'asc' ? '↑ A-Z' : '↓ Z-A'}
                </Button>
                <Button
                  onClick={() => onRemoveSort(sort.field)}
                  variant="outline"
                  size="sm"
                  className="px-2 py-1 text-xs text-red-600 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            </div>
          );
        })}
    </div>
  );
};
