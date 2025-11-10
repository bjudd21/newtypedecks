/**
 * Type Filters Component
 * Interactive card type filter buttons
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface TypeFiltersProps {
  selectedTypes: string[];
  onToggleType: (type: string) => void;
}

interface TypeButtonProps {
  type: string;
  isSelected: boolean;
  onClick: () => void;
}

function TypeButton({ type, isSelected, onClick }: TypeButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        'h-7 px-3 text-xs transition-all duration-300',
        isSelected
          ? 'border-[#8b7aaa] bg-[#6b5a8a] text-white shadow-md'
          : 'border-[#443a5c] bg-[#1a1625] text-white hover:border-[#6b5a8a] hover:bg-[#2d2640]'
      )}
    >
      {type}
    </Button>
  );
}

const CARD_TYPES = ['Unit', 'Command', 'Base', 'Pilot'];

export function TypeFilters({ selectedTypes, onToggleType }: TypeFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium text-gray-400">TYPE:</span>
      {CARD_TYPES.map((type) => (
        <TypeButton
          key={type}
          type={type}
          isSelected={selectedTypes.includes(type)}
          onClick={() => onToggleType(type)}
        />
      ))}
    </div>
  );
}
