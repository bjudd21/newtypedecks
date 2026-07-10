/**
 * NumberStrip — 0..max button strip for small numeric stats
 * (level, cost, AP, HP). Clicking the selected value clears it.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface NumberStripProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  max?: number;
}

export function NumberStrip({
  label,
  value,
  onChange,
  max = 10,
}: NumberStripProps) {
  const numbers = Array.from({ length: max + 1 }, (_, i) => i);

  return (
    <div>
      <span className="text-foreground mb-1.5 block text-sm font-medium">
        {label}
      </span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1">
        {numbers.map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? null : n)}
              className={cn(
                'focus-visible:ring-ring h-8 w-8 rounded-md border font-mono text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98]',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
