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
  types: string[];
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
          ? 'border-primary bg-primary/80 text-white shadow-md'
          : 'border-border bg-background hover:border-primary hover:bg-card text-white'
      )}
    >
      {type}
    </Button>
  );
}

export function TypeFilters({
  selectedTypes,
  onToggleType,
  types,
}: TypeFiltersProps) {
  if (types.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground mr-1 text-xs font-medium">
        TYPE:
      </span>
      {types.map((type) => (
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
