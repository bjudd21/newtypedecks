/**
 * Utility functions for Search
 */

import type { SearchSuggestion } from './types';

/**
 * Filter suggestions based on search value
 */
export function filterSuggestions(
  suggestions: SearchSuggestion[],
  value: string,
  maxSuggestions: number
): SearchSuggestion[] {
  return suggestions
    .filter(
      (suggestion) =>
        suggestion.label.toLowerCase().includes(value.toLowerCase()) ||
        suggestion.value.toLowerCase().includes(value.toLowerCase())
    )
    .slice(0, maxSuggestions);
}
