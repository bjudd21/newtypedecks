/**
 * ActiveFiltersDisplay Component
 * Displays all active filters with remove buttons
 */

'use client';

import React from 'react';
import { Badge } from '@/components/ui';
import type { AdvancedFilterOptions, FilterRange } from '../AdvancedFilters';

interface ActiveFiltersDisplayProps {
  filters: AdvancedFilterOptions;
  onRemoveTextFilter: (key: string) => void;
  onRemoveCategoricalFilter: (key: string, value: string) => void;
  onRemoveRangeFilter: (key: string) => void;
  onRemoveBooleanFilter: (key: string) => void;
}

export const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({
  filters,
  onRemoveTextFilter,
  onRemoveCategoricalFilter,
  onRemoveRangeFilter,
  onRemoveBooleanFilter,
}) => {
  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-gray-700">Active Filters</h4>
      <div className="flex flex-wrap gap-2">
        {/* Text filters */}
        {Object.entries(filters.textFilters).map(([key, value]) =>
          value ? (
            <button
              key={key}
              onClick={() => onRemoveTextFilter(key)}
              className="inline-block"
            >
              <Badge variant="secondary" className="cursor-pointer text-xs">
                {key}: {value} ×
              </Badge>
            </button>
          ) : null
        )}

        {/* Categorical filters */}
        {Object.entries(filters.categoricalFilters).map(([key, values]) =>
          Array.isArray(values) && values.length > 0
            ? values.map((value) => (
                <button
                  key={`${key}-${value}`}
                  onClick={() => onRemoveCategoricalFilter(key, value)}
                  className="inline-block"
                >
                  <Badge variant="secondary" className="cursor-pointer text-xs">
                    {key}: {value} ×
                  </Badge>
                </button>
              ))
            : null
        )}

        {/* Range filters */}
        {Object.entries(filters.rangeFilters).map(([key, range]) =>
          range && (range.min !== undefined || range.max !== undefined) ? (
            <button
              key={key}
              onClick={() => onRemoveRangeFilter(key)}
              className="inline-block"
            >
              <Badge variant="secondary" className="cursor-pointer text-xs">
                {key}: {(range as FilterRange).min || 0}-
                {(range as FilterRange).max || '∞'} ×
              </Badge>
            </button>
          ) : null
        )}

        {/* Boolean filters */}
        {Object.entries(filters.booleanFilters).map(([key, value]) =>
          value ? (
            <button
              key={key}
              onClick={() => onRemoveBooleanFilter(key)}
              className="inline-block"
            >
              <Badge variant="secondary" className="cursor-pointer text-xs">
                {key} ×
              </Badge>
            </button>
          ) : null
        )}
      </div>
    </div>
  );
};
