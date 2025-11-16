/**
 * Card stats grid (cost, level, attack, HP)
 */

import React from 'react';
import type { CardWithRelations } from '@/lib/types/card';

interface StatsGridProps {
  card: CardWithRelations;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ card }) => {
  const stats = [
    { label: 'Cost', value: card.cost },
    { label: 'Level', value: card.level },
    { label: 'Attack', value: card.attackPoints },
    { label: 'HP', value: card.hitPoints },
  ].filter((stat) => stat.value !== undefined && stat.value !== null);

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-gray-700 bg-gray-800 p-2.5"
        >
          <div className="text-xs text-gray-400">{stat.label}</div>
          <div className="text-lg font-bold text-white">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};
