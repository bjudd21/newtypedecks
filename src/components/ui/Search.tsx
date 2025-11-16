/**
 * Search - Backward compatibility re-export layer
 *
 * This file maintains backward compatibility for existing imports while
 * the actual implementation has been modularized into Search/
 */

// Main component exports
export { SearchComponent as Search } from './Search/SearchComponent';
export { SearchComponent as default } from './Search/SearchComponent';

// Type exports
export type { SearchSuggestion, SearchProps } from './Search/types';

// Utility exports
export { filterSuggestions } from './Search/utils';

// Hook exports
export { useSearchState } from './Search/hooks/useSearchState';
export { useSearchIds } from './Search/hooks/useSearchIds';
export { useOutsideClick } from './Search/hooks/useOutsideClick';
export { useDebouncedSearch } from './Search/hooks/useDebouncedSearch';
export { useSearchHandlers } from './Search/hooks/useSearchHandlers';

// Component exports
export { SearchLabel } from './Search/components/SearchLabel';
export { SearchIcon } from './Search/components/SearchIcon';
export { ClearButton } from './Search/components/ClearButton';
export { SearchInput } from './Search/components/SearchInput';
export { SuggestionItem } from './Search/components/SuggestionItem';
export { SuggestionsDropdown } from './Search/components/SuggestionsDropdown';
export { SearchError } from './Search/components/SearchError';
