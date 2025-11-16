/**
 * TypeScript type definitions for Search
 */

export interface SearchSuggestion {
  id: string;
  label: string;
  value: string;
  category?: string;
}

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  suggestions?: SearchSuggestion[];
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  showSuggestions?: boolean;
  maxSuggestions?: number;
  debounceMs?: number;
}
