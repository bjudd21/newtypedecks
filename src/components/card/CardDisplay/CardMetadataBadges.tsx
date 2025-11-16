/**
 * CardMetadataBadges - Type, rarity, level, cost badges
 */

import React from 'react';
import { Badge } from '@/components/ui';

interface CardMetadataBadgesProps {
  type?: { name: string } | null;
  rarity?: { name: string } | null;
  level?: number | null;
  cost?: number | null;
}

export const CardMetadataBadges: React.FC<CardMetadataBadgesProps> = ({
  type,
  rarity,
  level,
  cost,
}) => {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {type && (
        <Badge variant="secondary" className="text-xs">
          {type.name}
        </Badge>
      )}
      {rarity && (
        <Badge variant="secondary" className="text-xs">
          {rarity.name}
        </Badge>
      )}
      {level !== null && level !== undefined && (
        <Badge variant="info" className="text-xs">
          Level {level}
        </Badge>
      )}
      {cost !== null && cost !== undefined && (
        <Badge variant="info" className="text-xs">
          Cost {cost}
        </Badge>
      )}
    </div>
  );
};
