/**
 * Filter content component with all filter sections
 */

import React from 'react';
import {
  TextFiltersSection,
  CategoricalFiltersSection,
  RangeFiltersSection,
  BooleanFiltersSection,
  ActiveFiltersDisplay,
} from '../';
import type { AdvancedFilterOptions, ReferenceData } from '../types';

interface FilterContentProps {
  filters: AdvancedFilterOptions;
  referenceData: ReferenceData;
  activeFilterCount: number;
  onUpdateTextFilter: (key: string, value: string | undefined) => void;
  onAddCategoricalFilter: (key: string, value: string) => void;
  onRemoveCategoricalFilter: (key: string, value: string) => void;
  onUpdateRangeFilter: (
    field: string,
    type: 'min' | 'max',
    value: number | undefined
  ) => void;
  onUpdateBooleanFilter: (key: string, value: boolean | undefined) => void;
  onRemoveTextFilter: (key: string) => void;
  onRemoveRangeFilter: (key: string) => void;
  onRemoveBooleanFilter: (key: string) => void;
}

export const FilterContent: React.FC<FilterContentProps> = ({
  filters,
  referenceData,
  activeFilterCount,
  onUpdateTextFilter,
  onAddCategoricalFilter,
  onRemoveCategoricalFilter,
  onUpdateRangeFilter,
  onUpdateBooleanFilter,
  onRemoveTextFilter,
  onRemoveRangeFilter,
  onRemoveBooleanFilter,
}) => {
  return (
    <div className="space-y-6 p-4">
      {/* Text Filters */}
      <TextFiltersSection
        filters={filters.textFilters}
        onFilterChange={onUpdateTextFilter}
      />

      {/* Categorical Filters */}
      <CategoricalFiltersSection
        filters={filters.categoricalFilters}
        referenceData={referenceData}
        onAddFilter={onAddCategoricalFilter}
        onRemoveFilter={onRemoveCategoricalFilter}
      />

      {/* Range Filters */}
      <RangeFiltersSection
        filters={filters.rangeFilters}
        onRangeChange={onUpdateRangeFilter}
      />

      {/* Boolean Filters */}
      <BooleanFiltersSection
        filters={filters.booleanFilters}
        onFilterChange={onUpdateBooleanFilter}
      />

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <ActiveFiltersDisplay
          filters={filters}
          onRemoveTextFilter={onRemoveTextFilter}
          onRemoveCategoricalFilter={onRemoveCategoricalFilter}
          onRemoveRangeFilter={onRemoveRangeFilter}
          onRemoveBooleanFilter={onRemoveBooleanFilter}
        />
      )}
    </div>
  );
};
