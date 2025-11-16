/**
 * Grid of available sort fields component
 */

import React from 'react';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { ActiveSort, SortOption } from '../types';
import { getSortIcon, getSortPriority, isFieldSorted } from '../utils';

interface AvailableFieldsGridProps {
  sortOptions: SortOption[];
  activeSorts: ActiveSort[];
  maxSorts: number;
  onAddSort: (field: string, order: 'asc' | 'desc') => void;
}

export const AvailableFieldsGrid: React.FC<AvailableFieldsGridProps> = ({
  sortOptions,
  activeSorts,
  maxSorts,
  onAddSort,
}) => {
  return (
    <div className="space-y-2">
      <div className="mb-2 text-xs font-medium text-gray-600">
        Available Fields:
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {sortOptions.map((option) => {
          const isActive = isFieldSorted(option.key, activeSorts);
          const priority = getSortPriority(option.key, activeSorts);

          return (
            <div
              key={option.key}
              className={cn(
                'rounded border p-2 transition-colors',
                isActive
                  ? 'border-blue-200 bg-blue-50'
                  : 'bg-white hover:bg-gray-50'
              )}
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{option.label}</span>
                  {isActive && priority && (
                    <Badge variant="primary" className="text-xs">
                      {priority}
                    </Badge>
                  )}
                </div>
                {isActive && (
                  <span className="text-lg">
                    {getSortIcon(option.key, activeSorts)}
                  </span>
                )}
              </div>

              {option.description && (
                <div className="mb-2 text-xs text-gray-500">
                  {option.description}
                </div>
              )}

              <div className="flex gap-1">
                <Button
                  onClick={() => onAddSort(option.key, 'asc')}
                  variant={
                    isActive &&
                    activeSorts.find((s) => s.field === option.key)?.order ===
                      'asc'
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                  className="flex-1 text-xs"
                  disabled={!isActive && activeSorts.length >= maxSorts}
                >
                  ↑ Asc
                </Button>
                <Button
                  onClick={() => onAddSort(option.key, 'desc')}
                  variant={
                    isActive &&
                    activeSorts.find((s) => s.field === option.key)?.order ===
                      'desc'
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                  className="flex-1 text-xs"
                  disabled={!isActive && activeSorts.length >= maxSorts}
                >
                  ↓ Desc
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
