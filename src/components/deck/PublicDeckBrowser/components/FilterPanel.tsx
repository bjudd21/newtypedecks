/**
 * Filter panel component for searching and sorting decks
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Input, Select } from '@/components/ui';
import type { DeckFilters } from '../types';

interface FilterPanelProps {
  filters: DeckFilters;
  onFilterChange: (field: string, value: string) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Browse Community Decks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Search
            </label>
            <Input
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Search decks..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <Select
              value={filters.sortBy}
              onChange={(value: string) => onFilterChange('sortBy', value)}
              options={[
                { value: 'updatedAt', label: 'Recently Updated' },
                { value: 'createdAt', label: 'Recently Created' },
                { value: 'name', label: 'Name' },
              ]}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Order
            </label>
            <Select
              value={filters.sortOrder}
              onChange={(value: string) => onFilterChange('sortOrder', value)}
              options={[
                { value: 'desc', label: 'Descending' },
                { value: 'asc', label: 'Ascending' },
              ]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
