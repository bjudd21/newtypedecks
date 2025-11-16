/**
 * Filter toolbar component with colors, types, and action buttons
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { ColorFilters } from '@/components/card/ColorFilters';
import { TypeFilters } from '@/components/card/TypeFilters';
import { Button } from '@/components/ui';

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

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#443a5c] bg-[#2d2640] p-4">
      <ColorFilters
        selectedColors={selectedColors}
        onToggleColor={onToggleColor}
      />

      <div className="h-7 w-px bg-[#443a5c]" />

      <TypeFilters selectedTypes={selectedTypes} onToggleType={onToggleType} />

      <div className="h-7 w-px bg-[#443a5c]" />

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 border-[#443a5c] bg-[#1a1625] px-3 text-xs text-white hover:border-[#6b5a8a] hover:bg-[#6b5a8a]"
          onClick={() => router.push('/cards?view=sets')}
        >
          📚 Sets
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 border-[#443a5c] bg-[#1a1625] px-3 text-xs text-white hover:border-[#6b5a8a] hover:bg-[#6b5a8a]"
          onClick={onRandomCard}
        >
          🎲 Random
        </Button>
      </div>
    </div>
  );
};
