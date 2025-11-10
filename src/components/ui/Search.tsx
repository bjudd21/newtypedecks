// Search component for filtering and searching
'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { cn } from '@/lib/utils';
import { KEYBOARD_CODES } from '@/lib/utils/accessibility';

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

const Search: React.FC<SearchProps> = ({
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
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Generate unique IDs for accessibility (SSR-safe)
  const baseId = useId();
  const inputId = `search-input-${baseId}`;
  const listboxId = `search-listbox-${baseId}`;
  const labelId = `search-label-${baseId}`;
  const errorId = `search-error-${baseId}`;

  const filteredSuggestions = suggestions
    .filter(
      (suggestion) =>
        suggestion.label.toLowerCase().includes(value.toLowerCase()) ||
        suggestion.value.toLowerCase().includes(value.toLowerCase())
    )
    .slice(0, maxSuggestions);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(newValue);
      }
    }, debounceMs);

    // Show suggestions if there are any
    if (showSuggestions && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
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
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    onChange(suggestion.value);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    if (showSuggestions && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label
          id={labelId}
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div ref={searchRef} className="relative">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            disabled={disabled}
            role="combobox"
            aria-expanded={isOpen && filteredSuggestions.length > 0}
            aria-controls={isOpen ? listboxId : undefined}
            aria-activedescendant={
              highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
            }
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={error ? errorId : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            className={cn(
              'block w-full rounded-md border py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              error
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 text-gray-900',
              disabled && 'cursor-not-allowed bg-gray-50 text-gray-500'
            )}
          />
          {value && (
            <button
              onClick={() => {
                onChange('');
                setIsOpen(false);
                setHighlightedIndex(-1);
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
              aria-label="Clear search"
              tabIndex={-1}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {isOpen && showSuggestions && filteredSuggestions.length > 0 && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            aria-label="Search suggestions"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                onClick={() => handleSuggestionSelect(suggestion)}
                className={cn(
                  'relative cursor-pointer select-none px-4 py-2 hover:bg-blue-50 focus:outline-none focus:bg-blue-50',
                  index === highlightedIndex && 'bg-blue-100 text-blue-900'
                )}
              >
                <div className="flex flex-col">
                  <span className="block truncate font-normal">
                    {suggestion.label}
                  </span>
                  {suggestion.category && (
                    <span className="text-xs text-gray-500">
                      in {suggestion.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export { Search };
