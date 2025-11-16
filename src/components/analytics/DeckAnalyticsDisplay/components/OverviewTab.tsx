/**
 * Overview tab component with distribution charts
 */

import React from 'react';
import { DistributionChart } from '../../DistributionChart';
import type { DeckAnalytics } from '../types';

interface OverviewTabProps {
  analytics: DeckAnalytics;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <DistributionChart
        title="Card Types"
        data={analytics.typeDistribution}
        type="pie"
      />
      <DistributionChart
        title="Cost Distribution"
        data={analytics.costDistribution}
        type="bar"
      />
      <DistributionChart
        title="Rarity Distribution"
        data={analytics.rarityDistribution}
        type="pie"
      />
      <DistributionChart
        title="Faction Distribution"
        data={analytics.factionDistribution}
        type="pie"
      />
    </div>
  );
};
