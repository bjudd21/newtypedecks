/**
 * Search input component
 */

import React, { RefObject } from 'react';
import { cn } from '@/lib/utils';
import { SearchIcon } from './SearchIcon';
import { ClearButton } from './ClearButton';

interface SearchInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  inputId: string;
  labelId: string;
  errorId: string;
  listboxId: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  isOpen: boolean;
  filteredSuggestionsLength: number;
  highlightedIndex: number;
  label?: string;
  error?: string;
  onInputChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onFocus: () => void;
  onClear: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  inputRef,
  inputId,
  labelId,
  errorId,
  listboxId,
  value,
  placeholder,
  disabled,
  isOpen,
  filteredSuggestionsLength,
  highlightedIndex,
  label,
  error,
  onInputChange,
  onKeyDown,
  onFocus,
  onClear,
}) => {
  return (
    <div className="relative">
      <SearchIcon />
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder={placeholder}
        disabled={disabled}
        role="combobox"
        aria-expanded={isOpen && filteredSuggestionsLength > 0}
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={
          highlightedIndex >= 0
            ? `${listboxId}-option-${highlightedIndex}`
            : undefined
        }
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={error ? errorId : undefined}
        aria-autocomplete="list"
        autoComplete="off"
        className={cn(
          'placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary block w-full rounded-md border py-2 pr-3 pl-10 text-sm focus:ring-1 focus:outline-none',
          error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-border text-foreground',
          disabled && 'bg-accent text-muted-foreground/70 cursor-not-allowed'
        )}
      />
      {value && <ClearButton onClear={onClear} />}
    </div>
  );
};
