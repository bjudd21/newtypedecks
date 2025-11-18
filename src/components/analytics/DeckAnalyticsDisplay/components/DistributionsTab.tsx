/**
 * Distributions tab component with detailed analysis
 */

import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@/components/ui';
import type { DeckAnalytics } from '../types';

interface DistributionsTabProps {
  analytics: DeckAnalytics;
}

export const DistributionsTab: React.FC<DistributionsTabProps> = ({
  analytics,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detailed Distribution Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Type Distribution Details */}
            <div>
              <h4 className="mb-3 font-semibold text-gray-900">Card Types</h4>
              <div className="space-y-2">
                {Object.entries(analytics.typeDistribution).map(
                  ([type, data]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{type}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {data.count} cards
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {data.percentage}%
                        </Badge>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Cost Curve Details */}
            <div>
              <h4 className="mb-3 font-semibold text-gray-900">
                Cost Curve Analysis
              </h4>
              <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
                {Array.from({ length: 8 }, (_, i) => {
                  const cost = i;
                  const data = analytics.costDistribution[cost] || {
                    count: 0,
                    percentage: 0,
                  };
                  return (
                    <div key={cost} className="text-center">
                      <div className="text-xs font-medium text-gray-600">
                        Cost {cost}+
                      </div>
                      <div className="text-sm font-bold">{data.count}</div>
                      <div className="text-xs text-gray-500">
                        {data.percentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
