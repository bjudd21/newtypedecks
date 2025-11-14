'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserRole } from '@prisma/client';

interface DashboardStats {
  cards: {
    total: number;
  };
  users: {
    total: number;
    byRole: {
      [key in UserRole]: number;
    };
    recent: number;
  };
  recentActivity: Array<{
    type: string;
    name: string;
    timestamp: Date | string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();

        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-2 text-gray-300">
          Manage the Gundam Card Game database and community contributions.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/cards">
          <div className="group cursor-pointer overflow-hidden rounded-lg border border-[#443a5c] bg-[#2d2640]/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#8b7aaa] hover:shadow-lg hover:shadow-[#8b7aaa]/20">
            <div className="mb-4 flex items-center">
              <span className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#8b7aaa] to-[#6b5a8a] text-2xl shadow-lg">
                🃏
              </span>
              <h3 className="text-lg font-semibold text-white">
                Card Database
              </h3>
            </div>
            <p className="text-gray-300">
              Manage the card database, edit card information, and handle card
              metadata.
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-[#8b7aaa] transition-colors group-hover:text-[#a89ec7]">
              <span>Manage Cards</span>
              <svg
                className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>

        <Link href="/admin/users">
          <div className="group cursor-pointer overflow-hidden rounded-lg border border-[#443a5c] bg-[#2d2640]/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#8b7aaa] hover:shadow-lg hover:shadow-[#8b7aaa]/20">
            <div className="mb-4 flex items-center">
              <span className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#8b7aaa] to-[#6b5a8a] text-2xl shadow-lg">
                👥
              </span>
              <h3 className="text-lg font-semibold text-white">
                User Management
              </h3>
            </div>
            <p className="text-gray-300">
              Manage user accounts, permissions, and community moderation.
            </p>
            <div className="mt-4 flex items-center text-sm font-medium text-[#8b7aaa] transition-colors group-hover:text-[#a89ec7]">
              <span>Manage Users</span>
              <svg
                className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>

        <div className="overflow-hidden rounded-lg border border-[#443a5c] bg-[#2d2640]/60 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center">
            <span className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl shadow-lg">
              📊
            </span>
            <h3 className="text-lg font-semibold text-white">System Status</h3>
          </div>
          <p className="mb-4 text-gray-300">
            Monitor system health and performance metrics.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Database Status:</span>
              <span className="font-medium text-green-400">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Import Service:</span>
              <span className="font-medium text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">File Storage:</span>
              <span className="font-medium text-green-400">Available</span>
            </div>
          </div>
        </div>

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
      </div>

      {/* Recent Activity */}
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
    </div>
  );
}
