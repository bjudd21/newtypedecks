/**
 * Suggestion item component
 */

import React from 'react';
import { cn } from '@/lib/utils';
import type { SearchSuggestion } from '../types';

interface SuggestionItemProps {
  suggestion: SearchSuggestion;
  index: number;
  listboxId: string;
  isHighlighted: boolean;
  onSelect: (suggestion: SearchSuggestion) => void;
}

export const SuggestionItem: React.FC<SuggestionItemProps> = ({
  suggestion,
  index,
  listboxId,
  isHighlighted,
  onSelect,
}) => {
  return (
    <div
      id={`${listboxId}-option-${index}`}
      role="option"
      aria-selected={isHighlighted}
      onClick={() => onSelect(suggestion)}
      className={cn(
        'hover:bg-accent focus:bg-accent relative cursor-pointer px-4 py-2 select-none focus:outline-none',
        isHighlighted && 'bg-accent text-foreground'
      )}
    >
      <div className="flex flex-col">
        <span className="block truncate font-normal">{suggestion.label}</span>
        {suggestion.category && (
          <span className="text-muted-foreground/70 text-xs">
            in {suggestion.category}
          </span>
        )}
      </div>
    </div>
  );
};
