/**
 * Filter panel for template search and sorting
 */

import React from 'react';
import { Input, Select } from '@/components/ui';
import type { TemplateFilters } from '../types';

interface FilterPanelProps {
  filters: TemplateFilters;
  onFilterChange: (filters: Partial<TemplateFilters>) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          placeholder="Search templates..."
          className="flex-1"
        />

        <Select
          value={filters.sourceFilter}
          onChange={(value: string) => onFilterChange({ sourceFilter: value })}
          options={[
            { value: '', label: 'All Sources' },
            { value: 'Official', label: 'Official' },
            { value: 'Community', label: 'Community' },
            { value: 'Tournament', label: 'Tournament' },
          ]}
        />

        <Select
          value={filters.sortBy}
          onChange={(value: string) => onFilterChange({ sortBy: value })}
          options={[
            { value: 'usage', label: 'Most Used' },
            { value: 'favorites', label: 'Most Favorited' },
            { value: 'recent', label: 'Most Recent' },
            { value: 'name', label: 'Name' },
          ]}
        />
      </div>
    </div>
  );
};
