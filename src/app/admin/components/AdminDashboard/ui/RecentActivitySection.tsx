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
    <div className="overflow-hidden rounded-lg border border-[#443a5c] bg-[#2d2640]/60 p-6 backdrop-blur-md">
      <h3 className="mb-4 text-lg font-semibold text-white">
        Recent Activity
      </h3>
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#8b7aaa] border-t-transparent" />
        </div>
      ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
        <div className="space-y-3">
          {stats.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-[#443a5c] pb-3 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8b7aaa]/20 text-sm">
                  🃏
                </span>
                <div>
                  <div className="text-sm text-white">{activity.name}</div>
                  <div className="text-xs text-gray-400">Card created</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {formatDate(activity.timestamp)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-400">
          <p>No recent activity</p>
          <p className="mt-2 text-sm text-gray-500">
            Recent system events and administrative actions will appear here.
          </p>
        </div>
      )}
    </div>
  );
};
