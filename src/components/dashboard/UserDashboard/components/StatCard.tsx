/**
 * Stat card component
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui';
import type { Stat } from '../types';

interface StatCardProps {
  stat: Stat;
}

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground mb-1 text-sm font-medium">
              {stat.title}
            </p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
          <div className="text-2xl">{stat.icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};
