/**
 * AdvancedFiltersPanel Component
 * Container for all advanced card search filters
 */

'use client';

import React from 'react';
import { CardSearchFilters } from '@/lib/types/card';
import { FilterSelect } from './FilterSelect';
import { RangeFilter } from './RangeFilter';
import { SpecialTypesFilter } from './SpecialTypesFilter';

interface ReferenceData {
  types: Array<{ id: string; name: string; description?: string }>;
  rarities: Array<{
    id: string;
    name: string;
    color: string;
    description?: string;
  }>;
  sets: Array<{
    id: string;
    name: string;
    code: string;
    releaseDate: string;
    description?: string;
  }>;
}

interface AdvancedFiltersPanelProps {
  filters: CardSearchFilters;
  referenceData: ReferenceData;
  isLoadingReference: boolean;
  onFilterChange: (key: keyof CardSearchFilters, value: unknown) => void;
  onClearFilters: () => void;
}

export const AdvancedFiltersPanel: React.FC<AdvancedFiltersPanelProps> = ({
  filters,
  referenceData,
  isLoadingReference,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      {isLoadingReference && (
        <div className="mb-4 flex items-center gap-2 text-gray-600">
          <svg
            className="h-4 w-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Loading filter options...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card Type filter */}
        <FilterSelect
          label="Card Type"
          value={filters.typeId}
          options={referenceData.types.map((type) => ({
            value: type.id,
            label: type.name,
          }))}
          onChange={(value) => onFilterChange('typeId', value)}
          placeholder="All Types"
          disabled={isLoadingReference}
        />

        {/* Card Rarity filter */}
        <FilterSelect
          label="Rarity"
          value={filters.rarityId}
          options={referenceData.rarities.map((rarity) => ({
            value: rarity.id,
            label: rarity.name,
          }))}
          onChange={(value) => onFilterChange('rarityId', value)}
          placeholder="All Rarities"
          disabled={isLoadingReference}
        />

        {/* Card Set filter */}
        <FilterSelect
          label="Set"
          value={filters.setId}
          options={referenceData.sets.map((set) => ({
            value: set.id,
            label: `${set.name} (${set.code})`,
          }))}
          onChange={(value) => onFilterChange('setId', value)}
          placeholder="All Sets"
          disabled={isLoadingReference}
        />

        {/* Faction filter */}
        <FilterSelect
          label="Faction"
          value={filters.faction}
          options={[
            { value: 'Earth Federation', label: 'Earth Federation' },
            { value: 'Zeon', label: 'Zeon' },
            { value: 'AEUG', label: 'AEUG' },
            { value: 'Titans', label: 'Titans' },
            { value: 'Celestial Being', label: 'Celestial Being' },
            { value: 'A-Laws', label: 'A-Laws' },
          ]}
          onChange={(value) => onFilterChange('faction', value)}
          placeholder="All Factions"
        />

        {/* Series filter */}
        <FilterSelect
          label="Series"
          value={filters.series}
          options={[
            { value: 'UC', label: 'Universal Century' },
            { value: 'CE', label: 'Cosmic Era' },
            { value: 'AD', label: 'Anno Domini' },
            { value: 'AG', label: 'Advanced Generation' },
            { value: 'PD', label: 'Post Disaster' },
          ]}
          onChange={(value) => onFilterChange('series', value)}
          placeholder="All Series"
        />

        {/* Level range */}
        <RangeFilter
          label="Level Range"
          minValue={filters.levelMin}
          maxValue={filters.levelMax}
          onMinChange={(value) => onFilterChange('levelMin', value)}
          onMaxChange={(value) => onFilterChange('levelMax', value)}
          min={0}
          max={10}
        />

        {/* Cost range */}
        <RangeFilter
          label="Cost Range"
          minValue={filters.costMin}
          maxValue={filters.costMax}
          onMinChange={(value) => onFilterChange('costMin', value)}
          onMaxChange={(value) => onFilterChange('costMax', value)}
          min={0}
          max={20}
        />

        {/* Special card types */}
        <SpecialTypesFilter
          isFoil={filters.isFoil}
          isPromo={filters.isPromo}
          onFoilChange={(value) => onFilterChange('isFoil', value)}
          onPromoChange={(value) => onFilterChange('isPromo', value)}
        />
      </div>

      {/* Clear filters button */}
      {Object.keys(filters).length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClearFilters}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
