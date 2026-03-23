'use client';

import React from 'react';
import { WelcomeSection } from './components/WelcomeSection';
import { StatsGrid } from './components/StatsGrid';
import { GameSection } from './components/GameSection';
import { AccountInfoCard } from './components/AccountInfoCard';
import { SettingsCard } from './components/SettingsCard';
import type { UserDashboardProps } from './types';

export function UserDashboardComponent({
  user,
  dashboardData,
}: UserDashboardProps) {
  const { gameData, totalDecks, totalCardsOwned } = dashboardData;

  const stats = [
    {
      title: 'Total Decks',
      value: String(totalDecks),
      icon: '🃏',
      color: 'text-blue-400',
    },
    {
      title: 'Cards Owned',
      value: String(totalCardsOwned),
      icon: '📚',
      color: 'text-green-400',
    },
    {
      title: 'Active Games',
      value: String(gameData.length),
      icon: '🎮',
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <WelcomeSection userName={user.name} />

      <StatsGrid stats={stats} />

      {/* Per-game sections */}
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-gray-400 uppercase">
          Your Games
        </h2>
        {gameData.length === 0 ? (
          <p className="text-gray-500">No active games found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {gameData.map((data) => (
              <GameSection key={data.game.id} data={data} />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AccountInfoCard user={user} />
        <SettingsCard />
      </div>
    </div>
  );
}

export default UserDashboardComponent;
