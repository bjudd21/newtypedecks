/**
 * ToggleGroup — button-group single select for small enumerations
 * (card type, rarity, select-type custom fields).
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleGroupProps {
  label: string;
  options: ToggleOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  /** Clicking the selected option clears it (for optional fields). */
  allowDeselect?: boolean;
  error?: string;
}

export function ToggleGroup({
  label,
  options,
  value,
  onChange,
  allowDeselect = false,
  error,
}: ToggleGroupProps) {
  return (
    <div>
      <span className="text-foreground mb-1.5 block text-sm font-medium">
        {label}
      </span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() =>
                onChange(selected && allowDeselect ? null : option.value)
              }
              className={cn(
                'focus-visible:ring-ring rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98]',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-accent'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-destructive mt-1 text-sm">{error}</p>}
    </div>
  );
}
