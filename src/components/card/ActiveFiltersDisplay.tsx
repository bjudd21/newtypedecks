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
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#443a5c] bg-[#1a1625] p-3">
      <span className="text-xs font-medium text-gray-400">Active filters:</span>

      {selectedColors.map((color) => (
        <Badge
          key={color}
          className="flex cursor-pointer items-center gap-1.5 bg-[#6b5a8a] px-2.5 py-1 text-white transition-colors duration-200 hover:bg-[#8b7aaa]"
          onClick={() => onToggleColor(color)}
        >
          <span className="capitalize">{color}</span>
          <span className="text-xs">✕</span>
        </Badge>
      ))}

      {selectedTypes.map((type) => (
        <Badge
          key={type}
          className="flex cursor-pointer items-center gap-1.5 bg-[#6b5a8a] px-2.5 py-1 text-white transition-colors duration-200 hover:bg-[#8b7aaa]"
          onClick={() => onToggleType(type)}
        >
          {type}
          <span className="text-xs">✕</span>
        </Badge>
      ))}

      <button
        onClick={onClearAll}
        className="ml-auto text-xs font-medium text-[#8b7aaa] transition-colors duration-200 hover:text-[#a89ec7]"
      >
        Clear all
      </button>
    </div>
  );
}
