'use client';

import React, { useState } from 'react';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface SortOption {
  key: string;
  label: string;
  description?: string;
  defaultOrder?: 'asc' | 'desc';
  dataType?: 'text' | 'number' | 'date';
}

export interface ActiveSort {
  field: string;
  order: 'asc' | 'desc';
  priority: number; // For multiple sorts, lower number = higher priority
}

export interface AdvancedSortProps {
  sortOptions: SortOption[];
  activeSorts: ActiveSort[];
  onSortsChange: (sorts: ActiveSort[]) => void;
  maxSorts?: number;
  showMultiSort?: boolean;
  className?: string;
}

export const AdvancedSort: React.FC<AdvancedSortProps> = ({
  sortOptions,
  activeSorts,
  onSortsChange,
  maxSorts = 3,
  showMultiSort = true,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const addSort = (field: string, order: 'asc' | 'desc') => {
    // Check if this field is already being sorted
    const existingIndex = activeSorts.findIndex(sort => sort.field === field);

    if (existingIndex >= 0) {
      // Update existing sort
      const newSorts = [...activeSorts];
      newSorts[existingIndex] = { ...newSorts[existingIndex], order };
      onSortsChange(newSorts);
    } else {
      // Add new sort
      if (activeSorts.length >= maxSorts) {
        // Replace the lowest priority sort
        const newSorts = activeSorts
          .slice(0, maxSorts - 1)
          .map(sort => ({ ...sort, priority: sort.priority + 1 }));

        newSorts.unshift({ field, order, priority: 1 });
        onSortsChange(newSorts);
      } else {
        // Add new sort with highest priority
        const newSorts = [
          { field, order, priority: 1 },
          ...activeSorts.map(sort => ({ ...sort, priority: sort.priority + 1 }))
        ];
        onSortsChange(newSorts);
      }
    }
  };

  const removeSort = (field: string) => {
    const newSorts = activeSorts
      .filter(sort => sort.field !== field)
      .map((sort, index) => ({ ...sort, priority: index + 1 }));
    onSortsChange(newSorts);
  };

  const clearAllSorts = () => {
    onSortsChange([]);
  };

  const getSortIcon = (field: string) => {
    const sort = activeSorts.find(s => s.field === field);
    if (!sort) return null;

    return sort.order === 'asc' ? '↑' : '↓';
  };

  const getSortPriority = (field: string) => {
    const sort = activeSorts.find(s => s.field === field);
    return sort?.priority;
  };

  const isFieldSorted = (field: string) => {
    return activeSorts.some(sort => sort.field === field);
  };

  // Get the primary sort for simple display
  const primarySort = activeSorts.find(sort => sort.priority === 1);

  return (
    <div className={cn('space-y-2', className)}>
      {/* Simple Sort Control */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>

        {/* Primary sort selector */}
        <select
          value={primarySort ? `${primarySort.field}:${primarySort.order}` : ''}
          onChange={(e) => {
            if (!e.target.value) {
              clearAllSorts();
              return;
            }

            const [field, order] = e.target.value.split(':');
            if (!showMultiSort) {
              // Single sort mode - replace all sorts
              onSortsChange([{ field, order: order as 'asc' | 'desc', priority: 1 }]);
            } else {
              // Multi sort mode - add/update primary sort
              addSort(field, order as 'asc' | 'desc');
            }
          }}
          className="text-sm border border-gray-300 rounded px-2 py-1 min-w-0"
        >
          <option value="">Default</option>
          {sortOptions.map((option) => (
            <React.Fragment key={option.key}>
              <option value={`${option.key}:${option.defaultOrder || 'asc'}`}>
                {option.label} ({option.defaultOrder === 'desc' ? 'High-Low' : 'A-Z'})
              </option>
              <option value={`${option.key}:${option.defaultOrder === 'desc' ? 'asc' : 'desc'}`}>
                {option.label} ({option.defaultOrder === 'desc' ? 'Low-High' : 'Z-A'})
              </option>
            </React.Fragment>
          ))}
        </select>

        {/* Multi-sort indicator and toggle */}
        {showMultiSort && (
          <>
            {activeSorts.length > 1 && (
              <Badge variant="secondary" className="text-xs">
                +{activeSorts.length - 1} more
              </Badge>
            )}

            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {isExpanded ? 'Simple' : 'Advanced'}
            </Button>
          </>
        )}

        {/* Clear sorts */}
        {activeSorts.length > 0 && (
          <Button
            onClick={clearAllSorts}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Multi-Sort Controls */}
      {showMultiSort && isExpanded && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Multi-Column Sorting</h4>
              <div className="text-xs text-gray-500">
                Drag to reorder • Max {maxSorts} sorts
              </div>
            </div>

            {/* Active Sorts */}
            {activeSorts.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-600 mb-2">Active Sorts:</div>
                {activeSorts
                  .sort((a, b) => a.priority - b.priority)
                  .map((sort, index) => {
                    const option = sortOptions.find(opt => opt.key === sort.field);
                    return (
                      <div
                        key={sort.field}
                        className="flex items-center gap-2 bg-white border rounded px-3 py-2"
                      >
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span className="font-medium">{index + 1}.</span>
                        </div>
                        <div className="flex-1 text-sm">
                          {option?.label || sort.field}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            onClick={() => addSort(sort.field, sort.order === 'asc' ? 'desc' : 'asc')}
                            variant="outline"
                            size="sm"
                            className="text-xs px-2 py-1"
                          >
                            {sort.order === 'asc' ? '↑ A-Z' : '↓ Z-A'}
                          </Button>
                          <Button
                            onClick={() => removeSort(sort.field)}
                            variant="outline"
                            size="sm"
                            className="text-xs px-2 py-1 text-red-600 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Available Sort Options */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600 mb-2">Available Fields:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {sortOptions.map((option) => {
                  const isActive = isFieldSorted(option.key);
                  const priority = getSortPriority(option.key);

                  return (
                    <div
                      key={option.key}
                      className={cn(
                        'border rounded p-2 transition-colors',
                        isActive ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
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
                            {getSortIcon(option.key)}
                          </span>
                        )}
                      </div>

                      {option.description && (
                        <div className="text-xs text-gray-500 mb-2">
                          {option.description}
                        </div>
                      )}

                      <div className="flex gap-1">
                        <Button
                          onClick={() => addSort(option.key, 'asc')}
                          variant={isActive && activeSorts.find(s => s.field === option.key)?.order === 'asc' ? 'default' : 'outline'}
                          size="sm"
                          className="text-xs flex-1"
                          disabled={!isActive && activeSorts.length >= maxSorts}
                        >
                          ↑ Asc
                        </Button>
                        <Button
                          onClick={() => addSort(option.key, 'desc')}
                          variant={isActive && activeSorts.find(s => s.field === option.key)?.order === 'desc' ? 'default' : 'outline'}
                          size="sm"
                          className="text-xs flex-1"
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

            {/* Sorting Tips */}
            <div className="text-xs text-gray-500 bg-white border rounded p-2">
              <strong>Tips:</strong> Sort priority determines which field is sorted first.
              Lower numbers have higher priority. Use multiple sorts to create complex ordering
              like "Level (High-Low), then Name (A-Z)".
            </div>
          </div>
        </div>
      )}

      {/* Active Sorts Summary (when collapsed) */}
      {showMultiSort && !isExpanded && activeSorts.length > 0 && (
        <div className="text-xs text-gray-500">
          Sorting by: {activeSorts
            .sort((a, b) => a.priority - b.priority)
            .map((sort, index) => {
              const option = sortOptions.find(opt => opt.key === sort.field);
              return `${index > 0 ? ', then ' : ''}${option?.label || sort.field} ${sort.order === 'asc' ? '↑' : '↓'}`;
            })
            .join('')}
        </div>
      )}
    </div>
  );
};

export default AdvancedSort;