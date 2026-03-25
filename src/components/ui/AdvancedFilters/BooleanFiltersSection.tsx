/**
 * BooleanFiltersSection Component
 * Boolean filters for foil, promo, and alternate art cards
 */

'use client';

import React from 'react';
import type { AdvancedFilterOptions } from '../AdvancedFilters';

interface BooleanFiltersSectionProps {
  filters: AdvancedFilterOptions['booleanFilters'];
  onFilterChange: (key: string, value: boolean | undefined) => void;
}

export const BooleanFiltersSection: React.FC<BooleanFiltersSectionProps> = ({
  filters,
  onFilterChange,
}) => {
  const booleanOptions = [
    { key: 'isFoil', label: 'Foil Cards' },
    { key: 'isPromo', label: 'Promo Cards' },
    { key: 'isAlternate', label: 'Alternate Art' },
  ];

  return (
    <div>
      <h4 className="text-muted-foreground mb-3 text-sm font-medium">
        Special Properties
      </h4>
      <div className="flex flex-wrap gap-4">
        {booleanOptions.map((bool) => (
          <label key={bool.key} className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={filters[bool.key as keyof typeof filters] || false}
              onChange={(e) =>
                onFilterChange(bool.key, e.target.checked || undefined)
              }
              className="border-border text-primary focus:ring-primary mr-2 rounded"
            />
            <span>{bool.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
