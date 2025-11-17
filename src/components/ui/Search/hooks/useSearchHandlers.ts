/**
 * Hook for search handlers
 */

import { useCallback, RefObject } from 'react';
import { KEYBOARD_CODES } from '@/lib/utils/accessibility';
import type { SearchSuggestion } from '../types';

interface UseSearchHandlersOptions {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  showSuggestions: boolean;
  suggestions: SearchSuggestion[];
  filteredSuggestions: SearchSuggestion[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number | ((prev: number) => number)) => void;
  closeDropdown: () => void;
  triggerSearch: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export function useSearchHandlers({
  value,
  onChange,
  onSearch,
  onSuggestionSelect,
  showSuggestions,
  suggestions,
  filteredSuggestions,
  isOpen,
  setIsOpen,
  highlightedIndex,
  setHighlightedIndex,
  closeDropdown,
  triggerSearch,
  inputRef,
}: UseSearchHandlersOptions) {
  const handleInputChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
      triggerSearch(newValue);

      // Show suggestions if there are any
      if (showSuggestions && suggestions.length > 0) {
        setIsOpen(true);
      }
    },
    [onChange, triggerSearch, showSuggestions, suggestions.length, setIsOpen]
  );

  const handleSuggestionSelect = useCallback(
    (suggestion: SearchSuggestion) => {
      onChange(suggestion.value);
      if (onSuggestionSelect) {
        onSuggestionSelect(suggestion);
      }
      closeDropdown();
    },
    [onChange, onSuggestionSelect, closeDropdown]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen || filteredSuggestions.length === 0) {
        if (event.key === KEYBOARD_CODES.ENTER && onSearch) {
          onSearch(value);
        }
        return;
      }

      switch (event.key) {
        case KEYBOARD_CODES.ARROW_DOWN:
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case KEYBOARD_CODES.ARROW_UP:
          event.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case KEYBOARD_CODES.ENTER:
          event.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredSuggestions.length
          ) {
            handleSuggestionSelect(filteredSuggestions[highlightedIndex]);
          } else if (onSearch) {
            onSearch(value);
          }
          break;
        case KEYBOARD_CODES.ESCAPE:
          closeDropdown();
          break;
      }
    },
    [
      isOpen,
      filteredSuggestions,
      onSearch,
      value,
      highlightedIndex,
      setHighlightedIndex,
      closeDropdown,
      handleSuggestionSelect,
    ]
  );

  const handleInputFocus = useCallback(() => {
    if (showSuggestions && suggestions.length > 0) {
      setIsOpen(true);
    }
  }, [showSuggestions, suggestions.length, setIsOpen]);

  const handleClear = useCallback(() => {
    onChange('');
    closeDropdown();
    inputRef.current?.focus();
  }, [onChange, closeDropdown, inputRef]);

  return {
    handleInputChange,
    handleKeyDown,
    handleSuggestionSelect,
    handleInputFocus,
    handleClear,
  };
}
