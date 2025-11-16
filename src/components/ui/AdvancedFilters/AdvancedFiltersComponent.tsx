/**
 * AdvancedFilters - Main component for advanced filtering
 */

'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useExpansionState } from './hooks/useExpansionState';
import { useFilterManagement } from './hooks/useFilterManagement';
import { FilterHeader } from './components/FilterHeader';
import { FilterContent } from './components/FilterContent';
import { getActiveFilterCount } from './utils';
import type { AdvancedFiltersProps } from './types';

export const AdvancedFiltersComponent: React.FC<AdvancedFiltersProps> = ({
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
  // Expansion state
  const { isExpanded, toggle: toggleExpand } = useExpansionState(false);

  // Filter management
  const {
    updateFilters,
    updateRangeFilter,
    addArrayFilter,
    removeArrayFilter,
    clearAllFilters,
  } = useFilterManagement({
    filters,
    onFiltersChange,
  });

  // Calculate active filter count
  const activeFilterCount = useMemo(
    () => getActiveFilterCount(filters),
    [filters]
  );

  return (
    <div className={cn('rounded-lg border bg-white', className)}>
      {/* Header */}
      <FilterHeader
        activeFilterCount={activeFilterCount}
        isExpanded={isExpanded}
        onToggleExpand={toggleExpand}
        onClearAll={clearAllFilters}
      />

      {/* Filter Content */}
      {isExpanded && (
        <FilterContent
          filters={filters}
          referenceData={referenceData}
          activeFilterCount={activeFilterCount}
          onUpdateTextFilter={(key: string, value: string | undefined) =>
            updateFilters('textFilters', key, value)
          }
          onAddCategoricalFilter={(key: string, value: string) =>
            addArrayFilter('categoricalFilters', key, value)
          }
          onRemoveCategoricalFilter={(key: string, value: string) =>
            removeArrayFilter('categoricalFilters', key, value)
          }
          onUpdateRangeFilter={updateRangeFilter}
          onUpdateBooleanFilter={(key: string, value: boolean | undefined) =>
            updateFilters('booleanFilters', key, value)
          }
          onRemoveTextFilter={(key: string) =>
            updateFilters('textFilters', key, undefined)
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
  );
};

export default AdvancedFiltersComponent;
