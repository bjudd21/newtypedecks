/**
 * CategoricalFiltersSection Component
 * Checkbox filters for types, rarities, sets, factions, and series
 */

'use client';

import React from 'react';
import type {
  AdvancedFilterOptions,
  AdvancedFiltersProps,
} from '../AdvancedFilters';

interface CategoricalFiltersSectionProps {
  filters: AdvancedFilterOptions['categoricalFilters'];
  referenceData: AdvancedFiltersProps['referenceData'];
  onAddFilter: (key: string, value: string) => void;
  onRemoveFilter: (key: string, value: string) => void;
}

export const CategoricalFiltersSection: React.FC<
  CategoricalFiltersSectionProps
> = ({ filters, referenceData, onAddFilter, onRemoveFilter }) => {
  if (!referenceData) {
    return null;
  }

  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-gray-700">Categories</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Types */}
        {referenceData.types && referenceData.types.length > 0 && (
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Card Types
            </label>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {referenceData.types.map((type) => (
                <label key={type.id} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.typeIds?.includes(type.id) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onAddFilter('typeIds', type.id);
                      } else {
                        onRemoveFilter('typeIds', type.id);
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
        )}

        {/* Rarities */}
        {referenceData.rarities && referenceData.rarities.length > 0 && (
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Rarities
            </label>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {referenceData.rarities.map((rarity) => (
                <label key={rarity.id} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.rarityIds?.includes(rarity.id) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onAddFilter('rarityIds', rarity.id);
                      } else {
                        onRemoveFilter('rarityIds', rarity.id);
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
        )}

        {/* Factions */}
        {referenceData.factions && referenceData.factions.length > 0 && (
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Factions
            </label>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {referenceData.factions.map((faction) => (
                <label key={faction.name} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.factions?.includes(faction.name) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onAddFilter('factions', faction.name);
                      } else {
                        onRemoveFilter('factions', faction.name);
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
        )}

        {/* Sets */}
        {referenceData.sets && referenceData.sets.length > 0 && (
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Sets
            </label>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {referenceData.sets.map((set) => (
                <label key={set.id} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.setIds?.includes(set.id) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onAddFilter('setIds', set.id);
                      } else {
                        onRemoveFilter('setIds', set.id);
                      }
                    }}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    {set.name} ({set.code})
                  </span>
                  {set.count && (
                    <span className="ml-auto text-xs text-gray-400">
                      ({set.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Series */}
        {referenceData.series && referenceData.series.length > 0 && (
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Series
            </label>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {referenceData.series.map((series) => (
                <label key={series.name} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.series?.includes(series.name) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onAddFilter('series', series.name);
                      } else {
                        onRemoveFilter('series', series.name);
                      }
                    }}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{series.name}</span>
                  {series.count && (
                    <span className="ml-auto text-xs text-gray-400">
                      ({series.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
