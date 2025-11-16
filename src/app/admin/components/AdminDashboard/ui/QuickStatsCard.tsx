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
    <div className="overflow-hidden rounded-lg border border-[#443a5c] bg-[#2d2640]/60 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center">
        <span className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-2xl shadow-lg">
          ⚡
        </span>
        <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
      </div>
      {isLoading ? (
        <div className="flex h-20 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#8b7aaa] border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Cards:</span>
            <span className="font-medium text-gray-300">
              {stats?.cards.total.toLocaleString() || '0'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Active Users:</span>
            <span className="font-medium text-gray-300">
              {stats?.users.total.toLocaleString() || '0'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">New Users (30d):</span>
            <span className="font-medium text-gray-300">
              {stats?.users.recent.toLocaleString() || '0'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
