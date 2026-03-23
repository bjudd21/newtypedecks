/**
 * CollectionFilters Component
 * Filter controls for searching and filtering the collection
 */

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
} from '@/components/ui';
import { useGame } from '@/contexts/GameContext';

interface CollectionFiltersProps {
  filters: {
    search: string;
    rarity: string;
    type: string;
    faction: string;
  };
  onFilterChange: (field: string, value: string | number) => void;
}

export const CollectionFilters: React.FC<CollectionFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const game = useGame();
  const factionField = game.config.cardSchema.customFields.find(
    (f) => f.key === 'faction'
  );

  return (
    <Card className="mb-6 border-[#443a5c] bg-[#2d2640]">
      <CardHeader>
        <CardTitle className="text-[#a89ec7]">FILTER COLLECTION</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">
              Search
            </label>
            <Input
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Search by card name..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">
              Rarity
            </label>
            <Select
              value={filters.rarity}
              onChange={(value: string) => onFilterChange('rarity', value)}
              options={[
                { value: '', label: 'All Rarities' },
                { value: 'Common', label: 'Common' },
                { value: 'Uncommon', label: 'Uncommon' },
                { value: 'Rare', label: 'Rare' },
                { value: 'Super Rare', label: 'Super Rare' },
                { value: 'Secret Rare', label: 'Secret Rare' },
              ]}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">
              Type
            </label>
            <Select
              value={filters.type}
              onChange={(value: string) => onFilterChange('type', value)}
              options={[
                { value: '', label: 'All Types' },
                { value: 'Unit', label: 'Unit' },
                { value: 'Command', label: 'Command' },
                { value: 'Pilot', label: 'Pilot' },
                { value: 'Operation', label: 'Operation' },
              ]}
            />
          </div>

          {factionField && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">
                {factionField.label}
              </label>
              <Input
                value={filters.faction}
                onChange={(e) => onFilterChange('faction', e.target.value)}
                placeholder={`Filter by ${factionField.label.toLowerCase()}...`}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
