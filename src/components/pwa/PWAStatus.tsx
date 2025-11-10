'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import { pwaService, type PWAState } from '@/lib/services/pwaService';

interface PWAStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const PWAStatus: React.FC<PWAStatusProps> = ({
  className,
  showDetails = false,
}) => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: true,
    isServiceWorkerRegistered: false,
    updateAvailable: false,
    cacheSize: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pendingSync, setPendingSync] = useState<number>(0);

  useEffect(() => {
    loadPWAState();

    // Listen for PWA events
    const unsubscribeOnline = pwaService.on('online', (isOnline: boolean) => {
      setPwaState((prev) => ({ ...prev, isOnline }));
    });

    const unsubscribeUpdate = pwaService.on(
      'updateAvailable',
      (available: boolean) => {
        setPwaState((prev) => ({ ...prev, updateAvailable: available }));
      }
    );

    const unsubscribeCacheSize = pwaService.on('cacheSize', (size: number) => {
      setPwaState((prev) => ({ ...prev, cacheSize: size }));
    });

    const unsubscribeSynced = pwaService.on('deckSynced', () => {
      loadPendingSyncData();
    });

    // Load pending sync data
    loadPendingSyncData();

    return () => {
      unsubscribeOnline();
      unsubscribeUpdate();
      unsubscribeCacheSize();
      unsubscribeSynced();
    };
  }, []);

  const loadPWAState = async () => {
    try {
      const state = await pwaService.getPWAState();
      setPwaState(state);
    } catch (error) {
      console.error('Failed to load PWA state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingSyncData = async () => {
    try {
      const [offlineDecks, collectionUpdates] = await Promise.all([
        pwaService.getOfflineDecks(),
        pwaService.getOfflineCollectionUpdates(),
      ]);

      setPendingSync(offlineDecks.length + collectionUpdates.length);
    } catch (error) {
      console.error('Failed to load pending sync data:', error);
    }
  };

  const handleUpdateApp = async () => {
    try {
      await pwaService.updateServiceWorker();
    } catch (error) {
      console.error('Failed to update app:', error);
    }
  };

  const handleClearCache = async () => {
    try {
      await pwaService.clearCache();
      loadPWAState();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const handleInstallApp = async () => {
    try {
      await pwaService.showInstallPrompt();
    } catch (error) {
      console.error('Failed to show install prompt:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="h-3 w-3 animate-pulse rounded-full bg-gray-300"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  // Compact status indicator
  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Online/Offline indicator */}
        <div
          className={`h-3 w-3 rounded-full ${
            pwaState.isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}
        />

        {/* PWA status */}
        {pwaState.isInstalled && (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-xs text-blue-800"
          >
            📱 Installed
          </Badge>
        )}

        {/* Pending sync indicator */}
        {pendingSync > 0 && !pwaState.isOnline && (
          <Badge
            variant="outline"
            className="border-orange-300 text-xs text-orange-600"
          >
            {pendingSync} pending
          </Badge>
        )}

        {/* Update indicator */}
        {pwaState.updateAvailable && (
          <Badge
            variant="primary"
            className="bg-green-100 text-xs text-green-800"
          >
            Update
          </Badge>
        )}
      </div>
    );
  }

  // Detailed PWA status card
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📱 App Status
          <div
            className={`h-3 w-3 rounded-full ${
              pwaState.isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={
                  pwaState.isOnline ? 'text-green-600' : 'text-red-600'
                }
              >
                {pwaState.isOnline ? '🌐' : '📡'}
              </span>
              <span className="font-medium">Connection</span>
            </div>
            <Badge variant={pwaState.isOnline ? 'primary' : 'outline'}>
              {pwaState.isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>

          {/* Installation Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📱</span>
              <span className="font-medium">Installation</span>
            </div>
            <div className="flex items-center gap-2">
              {pwaState.isInstalled ? (
                <Badge
                  variant="primary"
                  className="bg-green-100 text-green-800"
                >
                  Installed
                </Badge>
              ) : pwaState.isInstallable ? (
                <Button
                  onClick={handleInstallApp}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Install
                </Button>
              ) : (
                <Badge variant="outline">Not Available</Badge>
              )}
            </div>
          </div>

          {/* Service Worker Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>⚙️</span>
              <span className="font-medium">Service Worker</span>
            </div>
            <Badge
              variant={
                pwaState.isServiceWorkerRegistered ? 'primary' : 'outline'
              }
            >
              {pwaState.isServiceWorkerRegistered ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {/* Update Status */}
          {pwaState.updateAvailable && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🔄</span>
                <span className="font-medium">Update Available</span>
              </div>
              <Button
                onClick={handleUpdateApp}
                variant="default"
                size="sm"
                className="bg-green-600 text-xs hover:bg-green-700"
              >
                Update App
              </Button>
            </div>
          )}

          {/* Cache Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>💾</span>
              <span className="font-medium">Cache Size</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {pwaService.formatCacheSize(pwaState.cacheSize)}
              </span>
              {pwaState.cacheSize > 0 && (
                <Button
                  onClick={handleClearCache}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Pending Sync Data */}
          {pendingSync > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🔄</span>
                <span className="font-medium">Pending Sync</span>
              </div>
              <Badge
                variant="outline"
                className="border-orange-300 text-orange-600"
              >
                {pendingSync} items
              </Badge>
            </div>
          )}

          {/* Offline Features */}
          <div className="border-t pt-4">
            <h4 className="mb-2 font-medium text-gray-900">
              📱 Offline Features
            </h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Browse cached cards and decks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Create and edit decks offline</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Auto-sync when back online</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Collection management</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {!pwaState.isOnline && (
            <div className="rounded border border-orange-200 bg-orange-50 p-3">
              <div className="mb-1 font-medium text-orange-900">
                📡 Offline Mode
              </div>
              <div className="mb-2 text-sm text-orange-700">
                You&apos;re currently offline. Your changes will sync
                automatically when you&apos;re back online.
              </div>
              {pendingSync > 0 && (
                <div className="text-xs text-orange-600">
                  {pendingSync} items waiting to sync
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAStatus;
