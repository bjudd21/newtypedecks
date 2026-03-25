/**
 * Suggestions dropdown component
 */

import React from 'react';
import { SuggestionItem } from './SuggestionItem';
import type { SearchSuggestion } from '../types';

interface SuggestionsDropdownProps {
  listboxId: string;
  suggestions: SearchSuggestion[];
  highlightedIndex: number;
  onSelect: (suggestion: SearchSuggestion) => void;
}

export const SuggestionsDropdown: React.FC<SuggestionsDropdownProps> = ({
  listboxId,
  suggestions,
  highlightedIndex,
  onSelect,
}) => {
  return (
    <div
      id={listboxId}
      role="listbox"
      className="ring-opacity-5 bg-card ring-border absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 focus:outline-none sm:text-sm"
      aria-label="Search suggestions"
    >
      {suggestions.map((suggestion, index) => (
        <SuggestionItem
          key={suggestion.id}
          suggestion={suggestion}
          index={index}
          listboxId={listboxId}
          isHighlighted={index === highlightedIndex}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
