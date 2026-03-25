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
      <h4 className="text-muted-foreground mb-3 text-sm font-medium">
        Categories
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Types */}
        {referenceData.types && referenceData.types.length > 0 && (
          <div>
            <label className="text-muted-foreground mb-2 block text-xs font-medium">
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
                    className="border-border mr-2 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{type.name}</span>
                  {type.count && (
                    <span className="text-muted-foreground ml-auto text-xs">
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
            <label className="text-muted-foreground mb-2 block text-xs font-medium">
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
                    className="border-border mr-2 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-1">
                    <div
                      className="h-3 w-3 rounded"
                      style={{ backgroundColor: rarity.color }}
                    />
                    <span>{rarity.name}</span>
                  </div>
                  {rarity.count && (
                    <span className="text-muted-foreground ml-auto text-xs">
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
            <label className="text-muted-foreground mb-2 block text-xs font-medium">
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
                    className="border-border mr-2 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{faction.name}</span>
                  {faction.count && (
                    <span className="text-muted-foreground ml-auto text-xs">
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
            <label className="text-muted-foreground mb-2 block text-xs font-medium">
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
                    className="border-border mr-2 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    {set.name} ({set.code})
                  </span>
                  {set.count && (
                    <span className="text-muted-foreground ml-auto text-xs">
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
            <label className="text-muted-foreground mb-2 block text-xs font-medium">
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
                    className="border-border mr-2 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{series.name}</span>
                  {series.count && (
                    <span className="text-muted-foreground ml-auto text-xs">
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
