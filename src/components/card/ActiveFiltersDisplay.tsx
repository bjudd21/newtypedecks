/**
 * Active Filters Display Component
 * Shows currently applied filters with ability to remove them
 */

'use client';

import React from 'react';
import { Badge } from '@/components/ui';

interface ActiveFiltersDisplayProps {
  selectedColors: string[];
  selectedTypes: string[];
  onToggleColor: (color: string) => void;
  onToggleType: (type: string) => void;
  onClearAll: () => void;
}

export function ActiveFiltersDisplay({
  selectedColors,
  selectedTypes,
  onToggleColor,
  onToggleType,
  onClearAll,
}: ActiveFiltersDisplayProps) {
  const hasFilters = selectedColors.length > 0 || selectedTypes.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="border-border bg-background flex flex-wrap items-center gap-3 rounded-lg border p-3">
      <span className="text-muted-foreground text-xs font-medium">
        Active filters:
      </span>

      {selectedColors.map((color) => (
        <Badge
          key={color}
          className="bg-primary/80 hover:bg-primary text-primary-foreground flex cursor-pointer items-center gap-1.5 px-2.5 py-1 transition-colors duration-200"
          onClick={() => onToggleColor(color)}
        >
          <span className="capitalize">{color}</span>
          <span className="text-xs">✕</span>
        </Badge>
      ))}

      {selectedTypes.map((type) => (
        <Badge
          key={type}
          className="bg-primary/80 hover:bg-primary text-primary-foreground flex cursor-pointer items-center gap-1.5 px-2.5 py-1 transition-colors duration-200"
          onClick={() => onToggleType(type)}
        >
          {type}
          <span className="text-xs">✕</span>
        </Badge>
      ))}

      <button
        onClick={onClearAll}
        className="text-primary hover:text-primary/80 ml-auto text-xs font-medium transition-colors duration-200"
      >
        Clear all
      </button>
    </div>
  );
}
