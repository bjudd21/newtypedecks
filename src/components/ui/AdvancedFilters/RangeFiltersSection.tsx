/**
 * RangeFiltersSection Component
 * Numeric range filters for level, cost, clash points, hit points, attack points
 */

'use client';

import React from 'react';
import { Input } from '@/components/ui';
import type { AdvancedFilterOptions } from '../AdvancedFilters';

interface RangeFiltersSectionProps {
  filters: AdvancedFilterOptions['rangeFilters'];
  onRangeChange: (key: string, type: 'min' | 'max', value: number | undefined) => void;
}

export const RangeFiltersSection: React.FC<RangeFiltersSectionProps> = ({
  filters,
  onRangeChange,
}) => {
  const ranges = [
    { key: 'level', label: 'Level', max: 10 },
    { key: 'cost', label: 'Cost', max: 20 },
    { key: 'clashPoints', label: 'Clash Points', max: 100 },
    { key: 'hitPoints', label: 'Hit Points', max: 200 },
    { key: 'attackPoints', label: 'Attack Points', max: 200 },
  ];

  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-gray-700">Numeric Ranges</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ranges.map((range) => (
          <div key={range.key}>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              {range.label}
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                min="0"
                max={range.max}
                value={
                  filters[range.key as keyof typeof filters]?.min?.toString() || ''
                }
                onChange={(e) =>
                  onRangeChange(
                    range.key,
                    'min',
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-20 text-sm"
              />
              <span className="text-gray-400">-</span>
              <Input
                type="number"
                placeholder="Max"
                min="0"
                max={range.max}
                value={
                  filters[range.key as keyof typeof filters]?.max?.toString() || ''
                }
                onChange={(e) =>
                  onRangeChange(
                    range.key,
                    'max',
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-20 text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
