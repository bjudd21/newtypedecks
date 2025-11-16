/**
 * SpecialTypesFilter Component
 * Checkbox filters for special card types (foil, promo, etc.)
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxOption {
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
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Special Types
      </label>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isFoil || false}
            onChange={(e) => onFoilChange(e.target.checked || undefined)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Foil Cards</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isPromo || false}
            onChange={(e) => onPromoChange(e.target.checked || undefined)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Promo Cards</span>
        </label>
      </div>
    </div>
  );
};
