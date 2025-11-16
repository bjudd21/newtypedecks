/**
 * AdvancedSort - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./AdvancedSort/ directory.
 */

export { AdvancedSortComponent as AdvancedSort } from './AdvancedSort/AdvancedSortComponent';
export { useSortLogic } from './AdvancedSort/hooks/useSortLogic';
export { SimpleSortSelector } from './AdvancedSort/components/SimpleSortSelector';
export { ActiveSortsList } from './AdvancedSort/components/ActiveSortsList';
export { AvailableFieldsGrid } from './AdvancedSort/components/AvailableFieldsGrid';
export { SortingSummary } from './AdvancedSort/components/SortingSummary';
export type { SortOption, ActiveSort, AdvancedSortProps } from './AdvancedSort/types';
export { getSortIcon, getSortPriority, isFieldSorted } from './AdvancedSort/utils';
export { AdvancedSortComponent as default } from './AdvancedSort/AdvancedSortComponent';
