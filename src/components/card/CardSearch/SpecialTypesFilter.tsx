/**
 * SpecialTypesFilter Component
 * Checkbox filters for special card types (foil, promo, etc.)
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface _CheckboxOption {
  key: string;
  label: string;
  checked: boolean;
}

interface SpecialTypesFilterProps {
  isFoil?: boolean;
  isPromo?: boolean;
  onFoilChange: (checked: boolean | undefined) => void;
  onPromoChange: (checked: boolean | undefined) => void;
  className?: string;
}

export const SpecialTypesFilter: React.FC<SpecialTypesFilterProps> = ({
  isFoil,
  isPromo,
  onFoilChange,
  onPromoChange,
  className,
}) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <label className="text-muted-foreground mb-2 block text-sm font-medium">
        Special Types
      </label>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isFoil || false}
            onChange={(e) => onFoilChange(e.target.checked || undefined)}
            className="border-border text-primary focus:ring-primary rounded"
          />
          <span className="text-muted-foreground ml-2 text-sm">Foil Cards</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isPromo || false}
            onChange={(e) => onPromoChange(e.target.checked || undefined)}
            className="border-border text-primary focus:ring-primary rounded"
          />
          <span className="text-muted-foreground ml-2 text-sm">
            Promo Cards
          </span>
        </label>
      </div>
    </div>
  );
};
