'use client';

import React, { useState } from 'react';
import { Button, Input, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface FilterRange {
  min?: number;
  max?: number;
}

export interface AdvancedFilterOptions {
  // Text filters
  textFilters: {
    name?: string;
    description?: string;
    pilot?: string;
    model?: string;
    keywords?: string[];
    tags?: string[];
  };

  // Categorical filters
  categoricalFilters: {
    typeIds?: string[];
    rarityIds?: string[];
    setIds?: string[];
    factions?: string[];
    series?: string[];
    nations?: string[];
    languages?: string[];
  };

  // Range filters
  rangeFilters: {
    level?: FilterRange;
    cost?: FilterRange;
    clashPoints?: FilterRange;
    price?: FilterRange;
    hitPoints?: FilterRange;
    attackPoints?: FilterRange;
  };

  // Boolean filters
  booleanFilters: {
    isFoil?: boolean;
    isPromo?: boolean;
    isAlternate?: boolean;
  };

  // Date filters
  dateFilters: {
    releaseDate?: {
      from?: Date;
      to?: Date;
    };
    addedDate?: {
      from?: Date;
      to?: Date;
    };
  };
}

export interface AdvancedFiltersProps {
  filters: AdvancedFilterOptions;
  onFiltersChange: (filters: AdvancedFilterOptions) => void;
  referenceData?: {
    types: Array<{ id: string; name: string; count?: number }>;
    rarities: Array<{
      id: string;
      name: string;
      color: string;
      count?: number;
    }>;
    sets: Array<{ id: string; name: string; code: string; count?: number }>;
    factions: Array<{ name: string; count?: number }>;
    series: Array<{ name: string; count?: number }>;
  };
  className?: string;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  referenceData = {
    types: [],
    rarities: [],
    sets: [],
    factions: [],
    series: [],
  },
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (
    section: keyof AdvancedFilterOptions,
    key: string,
    value: unknown
  ) => {
    const newFilters = {
      ...filters,
      [section]: {
        ...filters[section],
        [key]: value,
      },
    };
    onFiltersChange(newFilters);
  };

  const updateRangeFilter = (
    field: string,
    type: 'min' | 'max',
    value: number | undefined
  ) => {
    const currentRange =
      filters.rangeFilters[field as keyof typeof filters.rangeFilters] || {};
    const newRange = { ...currentRange, [type]: value };
    updateFilters('rangeFilters', field, newRange);
  };

  const addArrayFilter = (
    section: keyof AdvancedFilterOptions,
    key: string,
    value: string
  ) => {
    const current = (filters[section] as Record<string, string[]>)[key] || [];
    if (!current.includes(value)) {
      updateFilters(section, key, [...current, value]);
    }
  };

  const removeArrayFilter = (
    section: keyof AdvancedFilterOptions,
    key: string,
    value: string
  ) => {
    const current = (filters[section] as Record<string, string[]>)[key] || [];
    updateFilters(
      section,
      key,
      current.filter((item: string) => item !== value)
    );
  };

  const clearAllFilters = () => {
    onFiltersChange({
      textFilters: {},
      categoricalFilters: {},
      rangeFilters: {},
      booleanFilters: {},
      dateFilters: {},
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;

    // Count text filters
    Object.values(filters.textFilters).forEach((value) => {
      if (Array.isArray(value) ? value.length > 0 : value) count++;
    });

    // Count categorical filters
    Object.values(filters.categoricalFilters).forEach((value) => {
      if (Array.isArray(value) && value.length > 0) count++;
    });

    // Count range filters
    Object.values(filters.rangeFilters).forEach((range) => {
      if (range && (range.min !== undefined || range.max !== undefined))
        count++;
    });

    // Count boolean filters
    Object.values(filters.booleanFilters).forEach((value) => {
      if (value !== undefined) count++;
    });

    // Count date filters
    Object.values(filters.dateFilters).forEach((dateRange) => {
      if (dateRange && (dateRange.from || dateRange.to)) count++;
    });

    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={cn('rounded-lg border bg-white', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Advanced Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="default" className="text-xs">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button onClick={clearAllFilters} variant="outline" size="sm">
              Clear All
            </Button>
          )}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            size="sm"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="space-y-6 p-4">
          {/* Text Filters */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700">
              Text Search
            </h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Card Name"
                placeholder="Enter card name..."
                value={filters.textFilters.name || ''}
                onChange={(e) =>
                  updateFilters(
                    'textFilters',
                    'name',
                    e.target.value || undefined
                  )
                }
                className="text-sm"
              />
              <Input
                label="Pilot"
                placeholder="Enter pilot name..."
                value={filters.textFilters.pilot || ''}
                onChange={(e) =>
                  updateFilters(
                    'textFilters',
                    'pilot',
                    e.target.value || undefined
                  )
                }
                className="text-sm"
              />
              <Input
                label="Model"
                placeholder="Enter model name..."
                value={filters.textFilters.model || ''}
                onChange={(e) =>
                  updateFilters(
                    'textFilters',
                    'model',
                    e.target.value || undefined
                  )
                }
                className="text-sm"
              />
            </div>
          </div>

          {/* Categorical Filters */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700">
              Categories
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Types */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Card Types
                </label>
                <div className="max-h-32 space-y-1 overflow-y-auto">
                  {referenceData.types.map((type) => (
                    <label key={type.id} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={
                          filters.categoricalFilters.typeIds?.includes(
                            type.id
                          ) || false
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            addArrayFilter(
                              'categoricalFilters',
                              'typeIds',
                              type.id
                            );
                          } else {
                            removeArrayFilter(
                              'categoricalFilters',
                              'typeIds',
                              type.id
                            );
                          }
                        }}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{type.name}</span>
                      {type.count && (
                        <span className="ml-auto text-xs text-gray-400">
                          ({type.count})
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Rarities */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Rarities
                </label>
                <div className="max-h-32 space-y-1 overflow-y-auto">
                  {referenceData.rarities.map((rarity) => (
                    <label
                      key={rarity.id}
                      className="flex items-center text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={
                          filters.categoricalFilters.rarityIds?.includes(
                            rarity.id
                          ) || false
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            addArrayFilter(
                              'categoricalFilters',
                              'rarityIds',
                              rarity.id
                            );
                          } else {
                            removeArrayFilter(
                              'categoricalFilters',
                              'rarityIds',
                              rarity.id
                            );
                          }
                        }}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-1">
                        <div
                          className="h-3 w-3 rounded"
                          style={{ backgroundColor: rarity.color }}
                        />
                        <span>{rarity.name}</span>
                      </div>
                      {rarity.count && (
                        <span className="ml-auto text-xs text-gray-400">
                          ({rarity.count})
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Factions */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Factions
                </label>
                <div className="max-h-32 space-y-1 overflow-y-auto">
                  {referenceData.factions.map((faction) => (
                    <label
                      key={faction.name}
                      className="flex items-center text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={
                          filters.categoricalFilters.factions?.includes(
                            faction.name
                          ) || false
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            addArrayFilter(
                              'categoricalFilters',
                              'factions',
                              faction.name
                            );
                          } else {
                            removeArrayFilter(
                              'categoricalFilters',
                              'factions',
                              faction.name
                            );
                          }
                        }}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{faction.name}</span>
                      {faction.count && (
                        <span className="ml-auto text-xs text-gray-400">
                          ({faction.count})
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Range Filters */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700">
              Numeric Ranges
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { key: 'level', label: 'Level', max: 10 },
                { key: 'cost', label: 'Cost', max: 20 },
                { key: 'clashPoints', label: 'Clash Points', max: 100 },
                { key: 'hitPoints', label: 'Hit Points', max: 200 },
                { key: 'attackPoints', label: 'Attack Points', max: 200 },
              ].map((range) => (
                <div key={range.key}>
                  <label className="mb-2 block text-xs font-medium text-gray-600">
                    {range.label}
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      min="0"
                      max={range.max}
                      value={
                        filters.rangeFilters[
                          range.key as keyof typeof filters.rangeFilters
                        ]?.min?.toString() || ''
                      }
                      onChange={(e) =>
                        updateRangeFilter(
                          range.key,
                          'min',
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      className="w-20 text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      min="0"
                      max={range.max}
                      value={
                        filters.rangeFilters[
                          range.key as keyof typeof filters.rangeFilters
                        ]?.max?.toString() || ''
                      }
                      onChange={(e) =>
                        updateRangeFilter(
                          range.key,
                          'max',
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      className="w-20 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Boolean Filters */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700">
              Special Properties
            </h4>
            <div className="flex flex-wrap gap-4">
              {[
                { key: 'isFoil', label: 'Foil Cards' },
                { key: 'isPromo', label: 'Promo Cards' },
                { key: 'isAlternate', label: 'Alternate Art' },
              ].map((bool) => (
                <label key={bool.key} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={
                      filters.booleanFilters[
                        bool.key as keyof typeof filters.booleanFilters
                      ] || false
                    }
                    onChange={(e) =>
                      updateFilters(
                        'booleanFilters',
                        bool.key,
                        e.target.checked || undefined
                      )
                    }
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{bool.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-700">
                Active Filters
              </h4>
              <div className="flex flex-wrap gap-2">
                {/* Text filters */}
                {Object.entries(filters.textFilters).map(([key, value]) =>
                  value ? (
                    <button
                      key={key}
                      onClick={() =>
                        updateFilters('textFilters', key, undefined)
                      }
                      className="inline-block"
                    >
                      <Badge
                        variant="secondary"
                        className="cursor-pointer text-xs"
                      >
                        {key}: {value} ×
                      </Badge>
                    </button>
                  ) : null
                )}

                {/* Categorical filters */}
                {Object.entries(filters.categoricalFilters).map(
                  ([key, values]) =>
                    Array.isArray(values) && values.length > 0
                      ? values.map((value) => (
                          <button
                            key={`${key}-${value}`}
                            onClick={() =>
                              removeArrayFilter(
                                'categoricalFilters',
                                key,
                                value
                              )
                            }
                            className="inline-block"
                          >
                            <Badge
                              variant="secondary"
                              className="cursor-pointer text-xs"
                            >
                              {key}: {value} ×
                            </Badge>
                          </button>
                        ))
                      : null
                )}

                {/* Range filters */}
                {Object.entries(filters.rangeFilters).map(([key, range]) =>
                  range &&
                  (range.min !== undefined || range.max !== undefined) ? (
                    <button
                      key={key}
                      onClick={() => updateFilters('rangeFilters', key, {})}
                      className="inline-block"
                    >
                      <Badge
                        variant="secondary"
                        className="cursor-pointer text-xs"
                      >
                        {key}: {range.min || 0}-{range.max || '∞'} ×
                      </Badge>
                    </button>
                  ) : null
                )}

                {/* Boolean filters */}
                {Object.entries(filters.booleanFilters).map(([key, value]) =>
                  value ? (
                    <button
                      key={key}
                      onClick={() =>
                        updateFilters('booleanFilters', key, undefined)
                      }
                      className="inline-block"
                    >
                      <Badge
                        variant="secondary"
                        className="cursor-pointer text-xs"
                      >
                        {key} ×
                      </Badge>
                    </button>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
