/**
 * Version statistics display component
 */

import React from 'react';
import type { DeckVersion } from '../types';

interface VersionStatsProps {
  version: DeckVersion;
}

export const VersionStats: React.FC<VersionStatsProps> = ({ version }) => {
  return (
    <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
      <span>{version.cardCount} cards</span>
      <span>{version.uniqueCards} unique</span>
      <span>{version.totalCost} total cost</span>
      <span>by {version.createdBy.name || 'Unknown'}</span>
    </div>
  );
};
