/**
 * AdvancedFilters module exports
 */

// Main component
export { AdvancedFiltersComponent } from './AdvancedFiltersComponent';
export { AdvancedFiltersComponent as default } from './AdvancedFiltersComponent';

// Types
export * from './types';

// Hooks
export { useExpansionState } from './hooks/useExpansionState';
export { useFilterManagement } from './hooks/useFilterManagement';

// UI Components
export { FilterHeader } from './components/FilterHeader';
export { FilterContent } from './components/FilterContent';

// Existing section components
export { TextFiltersSection } from './TextFiltersSection';
export { CategoricalFiltersSection } from './CategoricalFiltersSection';
export { RangeFiltersSection } from './RangeFiltersSection';
export { BooleanFiltersSection } from './BooleanFiltersSection';
export { ActiveFiltersDisplay } from './ActiveFiltersDisplay';

// Utils
export * from './utils';
