/**
 * AdvancedSort - Main component with simple and advanced sorting modes
 */

'use client';

import React, { useState } from 'react';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useSortLogic } from './hooks/useSortLogic';
import { SimpleSortSelector } from './components/SimpleSortSelector';
import { ActiveSortsList } from './components/ActiveSortsList';
import { AvailableFieldsGrid } from './components/AvailableFieldsGrid';
import { SortingSummary } from './components/SortingSummary';
import type { AdvancedSortProps } from './types';

export const AdvancedSortComponent: React.FC<AdvancedSortProps> = ({
  sortOptions,
  activeSorts,
  onSortsChange,
  maxSorts = 3,
  showMultiSort = true,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { addSort, removeSort, clearAllSorts, primarySort } = useSortLogic({
    activeSorts,
    onSortsChange,
    maxSorts,
  });

  return (
    <div className={cn('space-y-2', className)}>
      {/* Simple Sort Control */}
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap text-sm text-gray-600">
          Sort by:
        </span>

        {/* Primary sort selector */}
        <SimpleSortSelector
          sortOptions={sortOptions}
          primarySort={primarySort}
          showMultiSort={showMultiSort}
          onClearAllSorts={clearAllSorts}
          onAddSort={addSort}
          onSortsChange={onSortsChange}
        />

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
        <div className="rounded-lg border bg-gray-50 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                Multi-Column Sorting
              </h4>
              <div className="text-xs text-gray-500">
                Drag to reorder • Max {maxSorts} sorts
              </div>
            </div>

            {/* Active Sorts */}
            <ActiveSortsList
              activeSorts={activeSorts}
              sortOptions={sortOptions}
              onAddSort={addSort}
              onRemoveSort={removeSort}
            />

            {/* Available Sort Options */}
            <AvailableFieldsGrid
              sortOptions={sortOptions}
              activeSorts={activeSorts}
              maxSorts={maxSorts}
              onAddSort={addSort}
            />

            {/* Sorting Tips */}
            <div className="rounded border bg-white p-2 text-xs text-gray-500">
              <strong>Tips:</strong> Sort priority determines which field is
              sorted first. Lower numbers have higher priority. Use multiple
              sorts to create complex ordering like &quot;Level (High-Low), then
              Name (A-Z)&quot;.
            </div>
          </div>
        </div>
      )}

      {/* Active Sorts Summary (when collapsed) */}
      {showMultiSort && !isExpanded && (
        <SortingSummary activeSorts={activeSorts} sortOptions={sortOptions} />
      )}
    </div>
  );
};

export default AdvancedSortComponent;
