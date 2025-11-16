/**
 * Search - Main component for search with suggestions
 */

'use client';

import React, { useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useSearchState } from './hooks/useSearchState';
import { useSearchIds } from './hooks/useSearchIds';
import { useOutsideClick } from './hooks/useOutsideClick';
import { useDebouncedSearch } from './hooks/useDebouncedSearch';
import { useSearchHandlers } from './hooks/useSearchHandlers';
import { SearchLabel } from './components/SearchLabel';
import { SearchInput } from './components/SearchInput';
import { SuggestionsDropdown } from './components/SuggestionsDropdown';
import { SearchError } from './components/SearchError';
import { filterSuggestions } from './utils';
import type { SearchProps } from './types';

export const SearchComponent: React.FC<SearchProps> = ({
  value,
  onChange,
  onSearch,
  suggestions = [],
  onSuggestionSelect,
  placeholder = 'Search...',
  disabled = false,
  className,
  label,
  error,
  showSuggestions = true,
  maxSuggestions = 10,
  debounceMs = 300,
}) => {
  // Refs
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // State
  const { isOpen, setIsOpen, highlightedIndex, setHighlightedIndex, closeDropdown } =
    useSearchState();

  // IDs for accessibility
  const { inputId, listboxId, labelId, errorId } = useSearchIds();

  // Filtered suggestions
  const filteredSuggestions = useMemo(
    () => filterSuggestions(suggestions, value, maxSuggestions),
    [suggestions, value, maxSuggestions]
  );

  // Click outside handler
  useOutsideClick(searchRef, closeDropdown);

  // Debounced search
  const { triggerSearch } = useDebouncedSearch({ onSearch, debounceMs });

  // Handlers
  const {
    handleInputChange,
    handleKeyDown,
    handleSuggestionSelect,
    handleInputFocus,
    handleClear,
  } = useSearchHandlers({
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
  });

  return (
    <div className={cn('relative', className)}>
      <SearchLabel labelId={labelId} inputId={inputId} label={label} />

      <div ref={searchRef} className="relative">
        <SearchInput
          inputRef={inputRef}
          inputId={inputId}
          labelId={labelId}
          errorId={errorId}
          listboxId={listboxId}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          isOpen={isOpen}
          filteredSuggestionsLength={filteredSuggestions.length}
          highlightedIndex={highlightedIndex}
          label={label}
          error={error}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onClear={handleClear}
        />

        {/* Suggestions dropdown */}
        {isOpen && showSuggestions && filteredSuggestions.length > 0 && (
          <SuggestionsDropdown
            listboxId={listboxId}
            suggestions={filteredSuggestions}
            highlightedIndex={highlightedIndex}
            onSelect={handleSuggestionSelect}
          />
        )}
      </div>

      <SearchError errorId={errorId} error={error} />
    </div>
  );
};

export default SearchComponent;
