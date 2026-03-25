/**
 * QuickStatsCard - Quick statistics display
 */

import React from 'react';
import type { DashboardStats } from '../types';

interface QuickStatsCardProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
  stats,
  isLoading,
}) => {
  return (
    <div className="border-border bg-card/60 overflow-hidden rounded-lg border p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center">
        <span className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-2xl shadow-lg">
          ⚡
        </span>
        <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
      </div>
      {isLoading ? (
        <div className="flex h-20 items-center justify-center">
          <div className="border-primary h-6 w-6 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Cards:</span>
            <span className="text-foreground font-medium">
              {stats?.cards.total.toLocaleString() || '0'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active Users:</span>
            <span className="text-foreground font-medium">
              {stats?.users.total.toLocaleString() || '0'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">New Users (30d):</span>
            <span className="text-foreground font-medium">
              {stats?.users.recent.toLocaleString() || '0'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
