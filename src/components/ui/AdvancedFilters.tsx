'use client';

import React, { useState } from 'react';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  TextFiltersSection,
  CategoricalFiltersSection,
  RangeFiltersSection,
  BooleanFiltersSection,
  ActiveFiltersDisplay,
} from './AdvancedFilters/';

export interface FilterRange {
  min?: number;
  max?: number;
}

export interface AdvancedFilterOptions {
  // Text filters
  textFilters: {
    name?: string;
    description?: string;
    pilot?: string;
    model?: string;
    keywords?: string[];
    tags?: string[];
  };

  // Categorical filters
  categoricalFilters: {
    typeIds?: string[];
    rarityIds?: string[];
    setIds?: string[];
    factions?: string[];
    series?: string[];
    nations?: string[];
    languages?: string[];
  };

  // Range filters
  rangeFilters: {
    level?: FilterRange;
    cost?: FilterRange;
    clashPoints?: FilterRange;
    price?: FilterRange;
    hitPoints?: FilterRange;
    attackPoints?: FilterRange;
  };

  // Boolean filters
  booleanFilters: {
    isFoil?: boolean;
    isPromo?: boolean;
    isAlternate?: boolean;
  };

  // Date filters
  dateFilters: {
    releaseDate?: {
      from?: Date;
      to?: Date;
    };
    addedDate?: {
      from?: Date;
      to?: Date;
    };
  };
}

export interface AdvancedFiltersProps {
  filters: AdvancedFilterOptions;
  onFiltersChange: (filters: AdvancedFilterOptions) => void;
  referenceData?: {
    types: Array<{ id: string; name: string; count?: number }>;
    rarities: Array<{
      id: string;
      name: string;
      color: string;
      count?: number;
    }>;
    sets: Array<{ id: string; name: string; code: string; count?: number }>;
    factions: Array<{ name: string; count?: number }>;
    series: Array<{ name: string; count?: number }>;
  };
  className?: string;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  referenceData = {
    types: [],
    rarities: [],
    sets: [],
    factions: [],
    series: [],
  },
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (
    section: keyof AdvancedFilterOptions,
    key: string,
    value: unknown
  ) => {
    const newFilters = {
      ...filters,
      [section]: {
        ...filters[section],
        [key]: value,
      },
    };
    onFiltersChange(newFilters);
  };

  const updateRangeFilter = (
    field: string,
    type: 'min' | 'max',
    value: number | undefined
  ) => {
    const currentRange =
      filters.rangeFilters[field as keyof typeof filters.rangeFilters] || {};
    const newRange = { ...currentRange, [type]: value };
    updateFilters('rangeFilters', field, newRange);
  };

  const addArrayFilter = (
    section: keyof AdvancedFilterOptions,
    key: string,
    value: string
  ) => {
    const current = (filters[section] as Record<string, string[]>)[key] || [];
    if (!current.includes(value)) {
      updateFilters(section, key, [...current, value]);
    }
  };

  const removeArrayFilter = (
    section: keyof AdvancedFilterOptions,
    key: string,
    value: string
  ) => {
    const current = (filters[section] as Record<string, string[]>)[key] || [];
    updateFilters(
      section,
      key,
      current.filter((item: string) => item !== value)
    );
  };

  const clearAllFilters = () => {
    onFiltersChange({
      textFilters: {},
      categoricalFilters: {},
      rangeFilters: {},
      booleanFilters: {},
      dateFilters: {},
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;

    // Count text filters
    Object.values(filters.textFilters).forEach((value) => {
      if (Array.isArray(value) ? value.length > 0 : value) count++;
    });

    // Count categorical filters
    Object.values(filters.categoricalFilters).forEach((value) => {
      if (Array.isArray(value) && value.length > 0) count++;
    });

    // Count range filters
    Object.values(filters.rangeFilters).forEach((range) => {
      if (range && (range.min !== undefined || range.max !== undefined))
        count++;
    });

    // Count boolean filters
    Object.values(filters.booleanFilters).forEach((value) => {
      if (value !== undefined) count++;
    });

    // Count date filters
    Object.values(filters.dateFilters).forEach((dateRange) => {
      if (dateRange && (dateRange.from || dateRange.to)) count++;
    });

    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={cn('rounded-lg border bg-white', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Advanced Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="default" className="text-xs">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button onClick={clearAllFilters} variant="outline" size="sm">
              Clear All
            </Button>
          )}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            size="sm"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="space-y-6 p-4">
          {/* Text Filters */}
          <TextFiltersSection
            filters={filters.textFilters}
            onFilterChange={(key: string, value: string | undefined) =>
              updateFilters('textFilters', key, value)
            }
          />

          {/* Categorical Filters */}
          <CategoricalFiltersSection
            filters={filters.categoricalFilters}
            referenceData={referenceData}
            onAddFilter={(key: string, value: string) =>
              addArrayFilter('categoricalFilters', key, value)
            }
            onRemoveFilter={(key: string, value: string) =>
              removeArrayFilter('categoricalFilters', key, value)
            }
          />

          {/* Range Filters */}
          <RangeFiltersSection
            filters={filters.rangeFilters}
            onRangeChange={updateRangeFilter}
          />

          {/* Boolean Filters */}
          <BooleanFiltersSection
            filters={filters.booleanFilters}
            onFilterChange={(key: string, value: boolean | undefined) =>
              updateFilters('booleanFilters', key, value)
            }
          />

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <ActiveFiltersDisplay
              filters={filters}
              onRemoveTextFilter={(key: string) =>
                updateFilters('textFilters', key, undefined)
              }
              onRemoveCategoricalFilter={(key: string, value: string) =>
                removeArrayFilter('categoricalFilters', key, value)
              }
              onRemoveRangeFilter={(key: string) =>
                updateFilters('rangeFilters', key, {})
              }
              onRemoveBooleanFilter={(key: string) =>
                updateFilters('booleanFilters', key, undefined)
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
