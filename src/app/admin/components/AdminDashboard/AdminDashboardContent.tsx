/**
 * AdminDashboardContent - Main component orchestrator
 */

'use client';

import { useDashboardStats } from './hooks/useDashboardStats';
import { QuickActionCard } from './ui/QuickActionCard';
import { SystemStatusCard } from './ui/SystemStatusCard';
import { QuickStatsCard } from './ui/QuickStatsCard';
import { RecentActivitySection } from './ui/RecentActivitySection';

export default function AdminDashboardContent() {
  const { stats, isLoading } = useDashboardStats();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-2 text-gray-300">
          Manage the Newtype Decks database and community contributions.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          href="/admin/cards"
          icon="🃏"
          title="Card Database"
          description="Manage the card database, edit card information, and handle card metadata."
          actionLabel="Manage Cards"
        />

        <QuickActionCard
          href="/admin/users"
          icon="👥"
          title="User Management"
          description="Manage user accounts, permissions, and community moderation."
          actionLabel="Manage Users"
        />

        <SystemStatusCard />

        <QuickStatsCard stats={stats} isLoading={isLoading} />
      </div>

      {/* Recent Activity */}
      <RecentActivitySection stats={stats} isLoading={isLoading} />
    </div>
  );
}
