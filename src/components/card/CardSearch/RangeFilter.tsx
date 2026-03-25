/**
 * RangeFilter Component
 * Reusable min/max range input for numeric filters
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface RangeFilterProps {
  label: string;
  minValue: number | undefined;
  maxValue: number | undefined;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  className?: string;
}

export const RangeFilter: React.FC<RangeFilterProps> = ({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  min = 0,
  max = 100,
  className,
}) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <label className="text-muted-foreground mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          min={min}
          max={max}
          placeholder="Min"
          value={minValue || ''}
          onChange={(e) =>
            onMinChange(e.target.value ? parseInt(e.target.value) : undefined)
          }
          className="border-border focus:border-primary block w-full rounded-md text-sm focus:ring-blue-500"
        />
        <input
          type="number"
          min={min}
          max={max}
          placeholder="Max"
          value={maxValue || ''}
          onChange={(e) =>
            onMaxChange(e.target.value ? parseInt(e.target.value) : undefined)
          }
          className="border-border focus:border-primary block w-full rounded-md text-sm focus:ring-blue-500"
        />
      </div>
    </div>
  );
};
