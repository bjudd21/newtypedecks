/**
 * Comparison header component showing version information
 */

import React from 'react';
import { Badge } from '@/components/ui';
import type { DeckVersion } from '../types';

interface ComparisonHeaderProps {
  versionA: DeckVersion;
  versionB: DeckVersion;
}

export const ComparisonHeader: React.FC<ComparisonHeaderProps> = ({
  versionA,
  versionB,
}) => {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <div>
        <Badge variant="outline">v{versionA.version}</Badge>
        <span className="ml-2">{versionA.versionName || versionA.name}</span>
      </div>
      <span>→</span>
      <div>
        <Badge variant="outline">v{versionB.version}</Badge>
        <span className="ml-2">{versionB.versionName || versionB.name}</span>
      </div>
    </div>
  );
};
