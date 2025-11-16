/**
 * Search Module Exports
 *
 * This module provides a comprehensive search component with:
 * - Accessibility-focused design (ARIA, keyboard navigation)
 * - Debounced search functionality
 * - Suggestion dropdown with filtering
 * - Outside click detection
 * - Error handling and display
 */

// Main component
export { SearchComponent } from './SearchComponent';

// Types
export type { SearchSuggestion, SearchProps } from './types';

// Utilities
export { filterSuggestions } from './utils';

// Hooks
export { useSearchState } from './hooks/useSearchState';
export { useSearchIds } from './hooks/useSearchIds';
export { useOutsideClick } from './hooks/useOutsideClick';
export { useDebouncedSearch } from './hooks/useDebouncedSearch';
export { useSearchHandlers } from './hooks/useSearchHandlers';

// Components
export { SearchLabel } from './components/SearchLabel';
export { SearchIcon } from './components/SearchIcon';
export { ClearButton } from './components/ClearButton';
export { SearchInput } from './components/SearchInput';
export { SuggestionItem } from './components/SuggestionItem';
export { SuggestionsDropdown } from './components/SuggestionsDropdown';
export { SearchError } from './components/SearchError';
