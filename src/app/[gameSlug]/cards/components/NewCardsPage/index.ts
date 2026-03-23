/**
 * NewCardsPage Module Exports
 *
 * This module provides a cards browsing page with:
 * - Card search and filtering
 * - Color and type filters
 * - Sorting controls
 * - Pagination
 * - Grid/list view toggle
 */

// Main component
export { NewCardsPageContent } from './NewCardsPageContent';

// API utilities
export { fetchCards, fetchRandomCard } from './api';

// Hooks
export { useCardsState } from './hooks/useCardsState';
export { useFilters } from './hooks/useFilters';
export { useCardHandlers } from './hooks/useCardHandlers';
export {
  useURLInitialization,
  useFilterEffects,
} from './hooks/useURLInitialization';

// UI Components
export { FilterToolbar } from './ui/FilterToolbar';
export { SortControls } from './ui/SortControls';
export { ViewToggle } from './ui/ViewToggle';
