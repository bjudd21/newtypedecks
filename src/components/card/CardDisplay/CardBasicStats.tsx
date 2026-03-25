/**
 * CardBasicStats - Faction, series, clash points, hit points
 */

import React from 'react';

interface CardBasicStatsProps {
  faction?: string | null;
  series?: string | null;
  clashPoints?: number | null;
  hitPoints?: number | null;
}

export const CardBasicStats: React.FC<CardBasicStatsProps> = ({
  faction,
  series,
  clashPoints,
  hitPoints,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {faction && (
        <div>
          <span className="text-muted-foreground font-medium">Faction:</span>
          <span className="ml-1 text-gray-800">{faction}</span>
        </div>
      )}
      {series && (
        <div>
          <span className="text-muted-foreground font-medium">Series:</span>
          <span className="ml-1 text-gray-800">{series}</span>
        </div>
      )}
      {clashPoints !== null && clashPoints !== undefined && (
        <div>
          <span className="text-muted-foreground font-medium">CP:</span>
          <span className="ml-1 text-gray-800">{clashPoints}</span>
        </div>
      )}
      {hitPoints !== null && hitPoints !== undefined && (
        <div>
          <span className="text-muted-foreground font-medium">HP:</span>
          <span className="ml-1 text-gray-800">{hitPoints}</span>
        </div>
      )}
    </div>
  );
};
