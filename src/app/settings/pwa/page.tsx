/**
 * PWA Settings Page
 * Manage Progressive Web App features, cache, and offline data
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { PWAStatus } from '@/components/pwa';
import { pwaService, type PWAState, type OfflineDeck } from '@/lib/services/pwaService';

export default function PWASettingsPage() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: true,
    isServiceWorkerRegistered: false,
    updateAvailable: false,
    cacheSize: 0
  });
  const [offlineDecks, setOfflineDecks] = useState<OfflineDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPWAData();

    // Listen for PWA events
    const unsubscribeOnline = pwaService.on('online', (isOnline: boolean) => {
      setPwaState(prev => ({ ...prev, isOnline }));
      if (isOnline) {
        loadOfflineData();
      }
    });

    const unsubscribeSynced = pwaService.on('deckSynced', () => {
      loadOfflineData();
    });

    const unsubscribeCacheCleared = pwaService.on('cacheCleared', () => {
      setPwaState(prev => ({ ...prev, cacheSize: 0 }));
    });

    return () => {
      unsubscribeOnline();
      unsubscribeSynced();
      unsubscribeCacheCleared();
    };
  }, []);

  const loadPWAData = async () => {
    try {
      const [state, decks] = await Promise.all([
        pwaService.getPWAState(),
        pwaService.getOfflineDecks()
      ]);

      setPwaState(state);
      setOfflineDecks(decks);
    } catch (error) {
      console.error('Failed to load PWA data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOfflineData = async () => {
    try {
      const decks = await pwaService.getOfflineDecks();
      setOfflineDecks(decks);
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  };

  const handleInstallApp = async () => {
    setActionLoading('install');
    try {
      const success = await pwaService.showInstallPrompt();
      if (success) {
        await loadPWAData();
      }
    } catch (error) {
      console.error('Failed to install app:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateApp = async () => {
    setActionLoading('update');
    try {
      await pwaService.updateServiceWorker();
    } catch (error) {
      console.error('Failed to update app:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear the cache? This will remove all cached content and may require re-downloading data.')) {
      return;
    }

    setActionLoading('clearCache');
    try {
      await pwaService.clearCache();
      await loadPWAData();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnregisterSW = async () => {
    if (!confirm('Are you sure you want to disable offline features? The app will no longer work offline.')) {
      return;
    }

    setActionLoading('unregister');
    try {
      await pwaService.unregisterServiceWorker();
      window.location.reload();
    } catch (error) {
      console.error('Failed to unregister service worker:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PWA settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          PWA Settings
        </h1>
        <p className="text-gray-600">
          Manage app installation, offline features, and cached data
        </p>
      </div>

      <div className="space-y-6">
        {/* PWA Status Overview */}
        <PWAStatus showDetails={true} />

        {/* Installation Management */}
        <Card>
          <CardHeader>
            <CardTitle>App Installation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pwaState.isInstalled ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" className="bg-green-100 text-green-800">
                      ✓ Installed
                    </Badge>
                    <span className="text-gray-700">App is installed and running</span>
                  </div>
                </div>
              ) : pwaState.isInstallable ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Install as App</div>
                    <div className="text-sm text-gray-600">
                      Install the Gundam Card Game Database as a native app for better performance and offline access
                    </div>
                  </div>
                  <Button
                    onClick={handleInstallApp}
                    variant="primary"
                    disabled={actionLoading === 'install'}
                  >
                    {actionLoading === 'install' ? 'Installing...' : 'Install App'}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-gray-600 mb-2">App installation not available</div>
                  <div className="text-sm text-gray-500">
                    Try using a supported browser or check if the app is already installed
                  </div>
                </div>
              )}

              {pwaState.updateAvailable && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-900 mb-1">Update Available</div>
                      <div className="text-sm text-green-700">
                        A new version of the app is available with improvements and bug fixes
                      </div>
                    </div>
                    <Button
                      onClick={handleUpdateApp}
                      variant="primary"
                      size="sm"
                      disabled={actionLoading === 'update'}
                    >
                      {actionLoading === 'update' ? 'Updating...' : 'Update Now'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cache Management */}
        <Card>
          <CardHeader>
            <CardTitle>Cache Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Cache Size</div>
                  <div className="text-sm text-gray-600">
                    Amount of data stored locally for offline access
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {pwaService.formatCacheSize(pwaState.cacheSize)}
                  </div>
                  {pwaState.cacheSize > 0 && (
                    <Button
                      onClick={handleClearCache}
                      variant="outline"
                      size="sm"
                      disabled={actionLoading === 'clearCache'}
                      className="mt-1"
                    >
                      {actionLoading === 'clearCache' ? 'Clearing...' : 'Clear Cache'}
                    </Button>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Cached Content</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Application Files</span>
                    <span className="text-green-600">✓ Cached</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Card Database</span>
                    <span className="text-green-600">✓ Partial</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">User Data</span>
                    <span className="text-blue-600">📱 Local Only</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offline Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>
              Offline Data
              {offlineDecks.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {offlineDecks.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {offlineDecks.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-gray-600 mb-2">No offline data</div>
                <div className="text-sm text-gray-500">
                  Data you create while offline will appear here and sync when you're back online
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-gray-600 mb-3">
                  The following data is stored offline and will sync when you're online:
                </div>
                {offlineDecks.map((deck) => (
                  <div key={deck.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                        🃏
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{deck.name}</div>
                        <div className="text-sm text-gray-600">
                          {deck.cards.length} cards • Created {deck.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={deck.synced ? 'primary' : 'outline'}>
                      {deck.synced ? 'Synced' : 'Pending'}
                    </Badge>
                  </div>
                ))}

                {!pwaState.isOnline && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
                    <div className="text-orange-900 font-medium mb-1">
                      📡 Currently Offline
                    </div>
                    <div className="text-orange-700 text-sm">
                      Data will automatically sync when you reconnect to the internet
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Service Worker</div>
                  <div className="text-sm text-gray-600">
                    Controls offline functionality and background sync
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={pwaState.isServiceWorkerRegistered ? 'primary' : 'outline'}>
                    {pwaState.isServiceWorkerRegistered ? 'Active' : 'Inactive'}
                  </Badge>
                  {pwaState.isServiceWorkerRegistered && (
                    <Button
                      onClick={handleUnregisterSW}
                      variant="outline"
                      size="sm"
                      disabled={actionLoading === 'unregister'}
                    >
                      {actionLoading === 'unregister' ? 'Disabling...' : 'Disable'}
                    </Button>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Offline Features</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={pwaState.isServiceWorkerRegistered ? 'text-green-600' : 'text-gray-400'}>
                      {pwaState.isServiceWorkerRegistered ? '✓' : '✗'}
                    </span>
                    <span>Offline page access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={pwaState.isServiceWorkerRegistered ? 'text-green-600' : 'text-gray-400'}>
                      {pwaState.isServiceWorkerRegistered ? '✓' : '✗'}
                    </span>
                    <span>Background data sync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={pwaState.isServiceWorkerRegistered ? 'text-green-600' : 'text-gray-400'}>
                      {pwaState.isServiceWorkerRegistered ? '✓' : '✗'}
                    </span>
                    <span>Cached resource serving</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={pwaState.isServiceWorkerRegistered ? 'text-green-600' : 'text-gray-400'}>
                      {pwaState.isServiceWorkerRegistered ? '✓' : '✗'}
                    </span>
                    <span>Offline deck building</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="text-yellow-900 font-medium mb-1">⚠️ Warning</div>
                <div className="text-yellow-700 text-sm">
                  Disabling the service worker will remove all offline functionality.
                  You'll need to refresh the page to re-enable offline features.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}