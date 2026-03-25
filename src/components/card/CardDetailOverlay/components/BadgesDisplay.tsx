/**
 * Card badges display (rarity, type, faction)
 */

import React from 'react';
import { Badge } from '@/components/ui';
import type { CardWithRelations } from '@/lib/types/card';

interface BadgesDisplayProps {
  card: CardWithRelations;
}

export const BadgesDisplay: React.FC<BadgesDisplayProps> = ({ card }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {card.rarity && (
        <Badge
          className={`${
            card.rarity.name?.toLowerCase() === 'rare'
              ? 'bg-yellow-600'
              : card.rarity.name?.toLowerCase() === 'super rare'
                ? 'bg-red-600'
                : card.rarity.name?.toLowerCase() === 'ultra rare'
                  ? 'bg-purple-600'
                  : 'bg-muted'
          }`}
        >
          {card.rarity.name}
        </Badge>
      )}
      {card.type && <Badge className="bg-secondary">{card.type.name}</Badge>}
      {card.faction && <Badge className="bg-green-600">{card.faction}</Badge>}
    </div>
  );
};
