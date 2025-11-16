/**
 * AdvancedFilters - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./AdvancedFilters/ directory.
 */

export { AdvancedFiltersComponent as AdvancedFilters } from './AdvancedFilters/AdvancedFiltersComponent';
export { AdvancedFiltersComponent as default } from './AdvancedFilters/AdvancedFiltersComponent';

// Re-export types
export type {
  FilterRange,
  AdvancedFilterOptions,
  ReferenceData,
  AdvancedFiltersProps,
} from './AdvancedFilters/types';

// Re-export hooks
export { useExpansionState } from './AdvancedFilters/hooks/useExpansionState';
export { useFilterManagement } from './AdvancedFilters/hooks/useFilterManagement';

// Re-export components
export { FilterHeader } from './AdvancedFilters/components/FilterHeader';
export { FilterContent } from './AdvancedFilters/components/FilterContent';

// Re-export utils
export { getActiveFilterCount, createEmptyFilters } from './AdvancedFilters/utils';
