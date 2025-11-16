/**
 * Rarity badge with custom color
 */

import React from 'react';
import { Badge } from '@/components/ui/Badge';

interface RarityBadgeProps {
  rarity?: { name: string; color: string } | null;
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({ rarity }) => {
  if (!rarity) {
    return <span className="text-sm text-gray-500">—</span>;
  }

  return (
    <Badge
      className="text-xs"
      style={{
        backgroundColor: `${rarity.color}20`,
        color: rarity.color,
        borderColor: `${rarity.color}40`,
      }}
    >
      {rarity.name}
    </Badge>
  );
};
