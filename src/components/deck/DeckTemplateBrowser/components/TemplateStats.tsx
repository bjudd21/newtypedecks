/**
 * Template statistics display component
 */

import React from 'react';

interface TemplateStatsProps {
  cardCount: number;
  uniqueCards: number;
  totalCost: number;
  usageCount: number;
}

export const TemplateStats: React.FC<TemplateStatsProps> = ({
  cardCount,
  uniqueCards,
  totalCost,
  usageCount,
}) => {
  return (
    <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
      <div>{cardCount} cards</div>
      <div>{uniqueCards} unique</div>
      <div>Cost: {totalCost}</div>
      <div>{usageCount} uses</div>
    </div>
  );
};
