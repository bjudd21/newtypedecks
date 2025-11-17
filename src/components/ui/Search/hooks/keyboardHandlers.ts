/**
 * Keyboard handling utilities for search
 */

import { KEYBOARD_CODES } from '@/lib/utils/accessibility';
import type { SearchSuggestion } from '../types';

/**
 * Handle keyboard navigation in search dropdown
 */
export function handleSearchKeyboardNavigation(
  event: React.KeyboardEvent,
  isOpen: boolean,
  filteredSuggestions: SearchSuggestion[],
  highlightedIndex: number,
  handlers: {
    onSearch?: (value: string) => void;
    setHighlightedIndex: (index: number | ((prev: number) => number)) => void;
    handleSuggestionSelect: (suggestion: SearchSuggestion) => void;
    closeDropdown: () => void;
  },
  value: string
): void {
  if (!isOpen || filteredSuggestions.length === 0) {
    if (event.key === KEYBOARD_CODES.ENTER && handlers.onSearch) {
      handlers.onSearch(value);
    }
    return;
  }

  switch (event.key) {
    case KEYBOARD_CODES.ARROW_DOWN:
      event.preventDefault();
      handlers.setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
      break;
    case KEYBOARD_CODES.ARROW_UP:
      event.preventDefault();
      handlers.setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      break;
    case KEYBOARD_CODES.ENTER:
      event.preventDefault();
      if (
        highlightedIndex >= 0 &&
        highlightedIndex < filteredSuggestions.length
      ) {
        handlers.handleSuggestionSelect(filteredSuggestions[highlightedIndex]);
      } else if (handlers.onSearch) {
        handlers.onSearch(value);
      }
      break;
    case KEYBOARD_CODES.ESCAPE:
      handlers.closeDropdown();
      break;
  }
}
