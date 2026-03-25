/**
 * Improvements tab component with deck improvement suggestions
 */

import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@/components/ui';
import { severityColors, severityIcons } from '../utils';
import type { DeckAnalytics } from '../types';

interface ImprovementsTabProps {
  analytics: DeckAnalytics;
}

export const ImprovementsTab: React.FC<ImprovementsTabProps> = ({
  analytics,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deck Improvements</CardTitle>
        <div className="text-muted-foreground text-sm">
          Recommended improvements based on competitive analysis
        </div>
      </CardHeader>
      <CardContent>
        {analytics.improvements.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <div className="mb-2 text-4xl">🎉</div>
            <p>Your deck looks well-optimized!</p>
            <p className="text-sm">No major improvements detected.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analytics.improvements.map((improvement, index) => (
              <div
                key={index}
                className={`rounded-lg border p-4 ${severityColors[improvement.severity]}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl">
                    {severityIcons[improvement.severity]}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {improvement.category.replace('-', ' ')}
                      </Badge>
                      <Badge
                        variant={
                          improvement.severity === 'critical'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-xs capitalize"
                      >
                        {improvement.severity}
                      </Badge>
                    </div>
                    <h4 className="mb-1 font-medium text-gray-900">
                      {improvement.description}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {improvement.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
