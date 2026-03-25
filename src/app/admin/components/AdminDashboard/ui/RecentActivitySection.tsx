/**
 * RecentActivitySection - Recent activity list
 */

import React from 'react';
import { formatDate } from '../utils';
import type { DashboardStats } from '../types';

interface RecentActivitySectionProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  stats,
  isLoading,
}) => {
  return (
    <div className="border-border bg-card/60 overflow-hidden rounded-lg border p-6 backdrop-blur-md">
      <h3 className="text-foreground mb-4 text-lg font-semibold">
        Recent Activity
      </h3>
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="border-primary h-6 w-6 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
        <div className="space-y-3">
          {stats.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="border-border flex items-center justify-between border-b pb-3 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full text-sm">
                  🃏
                </span>
                <div>
                  <div className="text-foreground text-sm">{activity.name}</div>
                  <div className="text-muted-foreground text-xs">
                    Card created
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground text-xs">
                {formatDate(activity.timestamp)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground py-8 text-center">
          <p>No recent activity</p>
          <p className="text-muted-foreground/70 mt-2 text-sm">
            Recent system events and administrative actions will appear here.
          </p>
        </div>
      )}
    </div>
  );
};
