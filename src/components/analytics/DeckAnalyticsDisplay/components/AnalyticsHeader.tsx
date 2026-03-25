/**
 * Analytics header component with overall rating and basic stats
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { CompetitiveRating } from '../../CompetitiveRating';
import type { DeckAnalytics } from '../types';

interface AnalyticsHeaderProps {
  deckName: string;
  analytics: DeckAnalytics;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  deckName,
  analytics,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{deckName} Analytics</span>
          <CompetitiveRating rating={analytics.competitiveRating} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.totalCards}
            </div>
            <div className="text-muted-foreground text-sm">Total Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analytics.uniqueCards}
            </div>
            <div className="text-muted-foreground text-sm">Unique Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {analytics.averageCost}
            </div>
            <div className="text-muted-foreground text-sm">Avg Cost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {analytics.totalCost}
            </div>
            <div className="text-muted-foreground text-sm">Total Cost</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
