/**
 * TextFiltersSection Component
 * Text input filters for card name, pilot, and model
 */

'use client';

import React from 'react';
import { Input } from '@/components/ui';
import type { AdvancedFilterOptions } from '../AdvancedFilters';

interface TextFiltersSectionProps {
  filters: AdvancedFilterOptions['textFilters'];
  onFilterChange: (key: string, value: string | undefined) => void;
}

export const TextFiltersSection: React.FC<TextFiltersSectionProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-gray-700">Text Search</h4>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Input
          label="Card Name"
          placeholder="Enter card name..."
          value={filters.name || ''}
          onChange={(e) => onFilterChange('name', e.target.value || undefined)}
          className="text-sm"
        />
        <Input
          label="Pilot"
          placeholder="Enter pilot name..."
          value={filters.pilot || ''}
          onChange={(e) => onFilterChange('pilot', e.target.value || undefined)}
          className="text-sm"
        />
        <Input
          label="Model"
          placeholder="Enter model name..."
          value={filters.model || ''}
          onChange={(e) => onFilterChange('model', e.target.value || undefined)}
          className="text-sm"
        />
      </div>
    </div>
  );
};
