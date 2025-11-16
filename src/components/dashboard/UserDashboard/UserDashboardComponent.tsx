'use client';

import React from 'react';
import { useQuickActions } from './hooks/useQuickActions';
import { STATS } from './constants';
import { WelcomeSection } from './components/WelcomeSection';
import { StatsGrid } from './components/StatsGrid';
import { QuickActionsCard } from './components/QuickActionsCard';
import { RecentActivityCard } from './components/RecentActivityCard';
import { AccountInfoCard } from './components/AccountInfoCard';
import { SettingsCard } from './components/SettingsCard';
import type { UserDashboardProps } from './types';

export function UserDashboardComponent({ user }: UserDashboardProps) {
  const quickActions = useQuickActions();

  return (
    <div className="mx-auto max-w-6xl">
      <WelcomeSection userName={user.name} />

      <StatsGrid stats={STATS} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <QuickActionsCard actions={quickActions} />
        <RecentActivityCard />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AccountInfoCard user={user} />
        <SettingsCard />
      </div>
    </div>
  );
}

export default UserDashboardComponent;
