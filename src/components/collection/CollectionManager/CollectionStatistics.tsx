/**
 * CollectionStatistics Component
 * Displays collection statistics in a grid of stat cards
 */

'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui';
import type { CollectionStatistics as CollectionStats } from '@/lib/types';

interface CollectionStatisticsProps {
  statistics: CollectionStats;
}

export const CollectionStatistics: React.FC<CollectionStatisticsProps> = ({
  statistics,
}) => {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card className="border-border bg-card">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {statistics.totalCards}
          </div>
          <div className="text-muted-foreground text-sm">Total Cards</div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {statistics.uniqueCards}
          </div>
          <div className="text-muted-foreground text-sm">Unique Cards</div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {statistics.completionPercentage}%
          </div>
          <div className="text-muted-foreground text-sm">
            Collection Complete
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">
            ${statistics.totalValue?.toFixed(2) || '0.00'}
          </div>
          <div className="text-muted-foreground text-sm">Collection Value</div>
        </CardContent>
      </Card>
    </div>
  );
};
