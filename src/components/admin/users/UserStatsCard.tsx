'use client';

import { Badge } from '@/components/ui/Badge';
import { UserRole } from '@prisma/client';

interface UserStatistics {
  total: number;
  byRole: {
    [key in UserRole]: number;
  };
  verified: number;
  unverified: number;
  recentSignups: {
    last7Days: number;
    last30Days: number;
  };
}

interface UserStatsCardProps {
  stats: UserStatistics;
  isLoading?: boolean;
}

export function UserStatsCard({ stats, isLoading }: UserStatsCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#443a5c] bg-[#2d2640]/60 p-6 backdrop-blur-md">
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8b7aaa] border-t-transparent" />
        </div>
      </div>
    );
  }

  const roleData = [
    {
      role: UserRole.ADMIN,
      count: stats.byRole[UserRole.ADMIN],
      label: 'Admins',
      variant: 'destructive' as const,
    },
    {
      role: UserRole.MODERATOR,
      count: stats.byRole[UserRole.MODERATOR],
      label: 'Moderators',
      variant: 'warning' as const,
    },
    {
      role: UserRole.USER,
      count: stats.byRole[UserRole.USER],
      label: 'Users',
      variant: 'secondary' as const,
    },
  ];

  return (
    <div className="rounded-lg border border-[#443a5c] bg-[#2d2640]/60 p-6 backdrop-blur-md">
      <h3 className="mb-6 text-lg font-semibold text-white">User Statistics</h3>

      {/* Total Users */}
      <div className="mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-white">
            {stats.total.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-400">Total Users</div>
        </div>
      </div>

      {/* Users by Role */}
      <div className="mb-6 space-y-3">
        <div className="text-sm font-medium text-gray-300">By Role</div>
        <div className="grid gap-3">
          {roleData.map(({ role, count, label, variant }) => (
            <div
              key={role}
              className="flex items-center justify-between rounded-md border border-[#443a5c] bg-[#1a1625] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Badge variant={variant} className="text-xs">
                  {role}
                </Badge>
                <span className="text-sm text-gray-300">{label}</span>
              </div>
              <span className="text-lg font-semibold text-white">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="space-y-3 border-t border-[#443a5c] pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
              <svg
                className="h-3 w-3 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="text-sm text-gray-300">Verified</span>
          </div>
          <span className="text-sm font-medium text-white">
            {stats.verified}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-500/20">
              <svg
                className="h-3 w-3 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="text-sm text-gray-300">Unverified</span>
          </div>
          <span className="text-sm font-medium text-white">
            {stats.unverified}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
              <svg
                className="h-3 w-3 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </span>
            <span className="text-sm text-gray-300">New (30 days)</span>
          </div>
          <span className="text-sm font-medium text-white">
            {stats.recentSignups.last30Days}
          </span>
        </div>
      </div>
    </div>
  );
}
