/**
 * Performance metrics component
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { getRatingColor } from '../utils';
import type { DeckAnalytics } from '../types';

interface PerformanceMetricsProps {
  analytics: DeckAnalytics;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  analytics,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="text-lg font-semibold">Card Efficiency</div>
            <div
              className={`inline-block rounded-full px-3 py-1 text-2xl font-bold ${getRatingColor(analytics.cardEfficiency * 10)}`}
            >
              {analytics.cardEfficiency}
            </div>
            <div className="mt-1 text-xs text-gray-600">
              Power-to-cost ratio
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">Deck Balance</div>
            <div
              className={`inline-block rounded-full px-3 py-1 text-2xl font-bold ${getRatingColor(analytics.deckBalance)}`}
            >
              {analytics.deckBalance}%
            </div>
            <div className="mt-1 text-xs text-gray-600">
              Distribution balance
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">Synergy Score</div>
            <div
              className={`inline-block rounded-full px-3 py-1 text-2xl font-bold ${getRatingColor(analytics.synergyScore)}`}
            >
              {analytics.synergyScore}%
            </div>
            <div className="mt-1 text-xs text-gray-600">Card interactions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
