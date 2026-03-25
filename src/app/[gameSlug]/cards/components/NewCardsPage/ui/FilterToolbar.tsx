'use client';
/**
 * Filter toolbar component with colors, types, and action buttons
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { ColorFilters } from '@/components/card/ColorFilters';
import { TypeFilters } from '@/components/card/TypeFilters';
import { Button } from '@/components/ui';
import { useGame } from '@/contexts/GameContext';

interface FilterToolbarProps {
  selectedColors: string[];
  selectedTypes: string[];
  onToggleColor: (color: string) => void;
  onToggleType: (type: string) => void;
  onRandomCard: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  selectedColors,
  selectedTypes,
  onToggleColor,
  onToggleType,
  onRandomCard,
}) => {
  const router = useRouter();
  const game = useGame();

  const colorField = game.config.cardSchema.customFields.find(
    (f) => f.key === 'color'
  );
  const gameColors = colorField?.options ?? [];
  const gameTypes = game.config.cardTypes;

  return (
    <div className="border-border bg-card flex flex-wrap items-center gap-3 rounded-lg border p-4">
      <ColorFilters
        selectedColors={selectedColors}
        onToggleColor={onToggleColor}
        colors={gameColors}
      />

      {gameColors.length > 0 && <div className="bg-border h-7 w-px" />}

      <TypeFilters
        selectedTypes={selectedTypes}
        onToggleType={onToggleType}
        types={gameTypes}
      />

      <div className="bg-border h-7 w-px" />

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-border bg-background hover:border-primary hover:bg-primary/80 h-7 px-3 text-xs text-white"
          onClick={() => router.push('/cards?view=sets')}
        >
          📚 Sets
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-border bg-background hover:border-primary hover:bg-primary/80 h-7 px-3 text-xs text-white"
          onClick={onRandomCard}
        >
          🎲 Random
        </Button>
      </div>
    </div>
  );
};
