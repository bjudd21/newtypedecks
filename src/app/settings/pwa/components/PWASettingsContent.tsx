/**
 * PWA Settings Content - Main component orchestrator
 */

'use client';

import React, { useEffect } from 'react';
import { PWAStatus } from '@/components/pwa';
import { usePWAState } from './hooks/usePWAState';
import { usePWAEventListeners } from './hooks/usePWAEventListeners';
import { usePWAHandlers } from './hooks/usePWAHandlers';
import { LoadingState } from './LoadingState';
import { PageHeader } from './PageHeader';
import { InstallationCard } from './cards/InstallationCard';
import { CacheManagementCard } from './cards/CacheManagementCard';
import { OfflineDataCard } from './cards/OfflineDataCard';
import { AdvancedSettingsCard } from './cards/AdvancedSettingsCard';

export function PWASettingsContent() {
  const {
    pwaState,
    setPwaState,
    offlineDecks,
    isLoading,
    actionLoading,
    setActionLoading,
    loadPWAData,
    loadOfflineData,
  } = usePWAState();

  // Set up event listeners
  usePWAEventListeners({ setPwaState, loadOfflineData });

  // Set up action handlers
  const {
    handleInstallApp,
    handleUpdateApp,
    handleClearCache,
    handleUnregisterSW,
  } = usePWAHandlers({ setActionLoading, loadPWAData });

  // Load initial data
  useEffect(() => {
    loadPWAData();
  }, [loadPWAData]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <PageHeader />

      <div className="space-y-6">
        {/* PWA Status Overview */}
        <PWAStatus showDetails={true} />

        {/* Installation Management */}
        <InstallationCard
          pwaState={pwaState}
          actionLoading={actionLoading}
          onInstallApp={handleInstallApp}
          onUpdateApp={handleUpdateApp}
        />

        {/* Cache Management */}
        <CacheManagementCard
          pwaState={pwaState}
          actionLoading={actionLoading}
          onClearCache={handleClearCache}
        />

        {/* Offline Data Management */}
        <OfflineDataCard pwaState={pwaState} offlineDecks={offlineDecks} />

        {/* Advanced Settings */}
        <AdvancedSettingsCard
          pwaState={pwaState}
          actionLoading={actionLoading}
          onUnregisterSW={handleUnregisterSW}
        />
      </div>
    </div>
  );
}
