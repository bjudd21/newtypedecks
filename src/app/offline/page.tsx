/**
 * Offline Page
 * Shown when user is offline and requested page is not cached
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setLastAttempt(new Date());
    window.location.reload();
  };

  const goHome = () => {
    window.location.href = '/';
  };

  const clearCache = async () => {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );

        // Reload after cache clear
        window.location.reload();
      } catch (error) {
        console.error('Failed to clear cache:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 21l-2.121-2.121m0 0L21 12l-2.121 2.121m0 0L12 21l2.121-2.121M12 21V9m0 0L9.879 6.879M12 9l2.121-2.121"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                You're Offline
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                This page isn't available offline. Check your internet connection and try again.
              </p>

              {/* Online Status Indicator */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isOnline ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className={`text-sm ${
                  isOnline ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isOnline ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              {lastAttempt && (
                <p className="text-xs text-gray-500 mb-4">
                  Last attempt: {lastAttempt.toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Available Offline Content */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Available Offline
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                  <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                    🃏
                  </div>
                  <div>
                    <div className="font-medium text-green-900">Recently Viewed Cards</div>
                    <div className="text-sm text-green-700">Cached card data</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50">
                  <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                    📚
                  </div>
                  <div>
                    <div className="font-medium text-blue-900">Saved Decks</div>
                    <div className="text-sm text-blue-700">Local deck storage</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-purple-50">
                  <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                    💾
                  </div>
                  <div>
                    <div className="font-medium text-purple-900">Collection Data</div>
                    <div className="text-sm text-purple-700">Cached collection info</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                variant="primary"
                className="w-full"
                disabled={!isOnline}
              >
                {isOnline ? 'Try Again' : 'Waiting for Connection...'}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={goHome}
                  variant="outline"
                  className="w-full"
                >
                  Go Home
                </Button>
                <Button
                  onClick={clearCache}
                  variant="outline"
                  className="w-full text-xs"
                >
                  Clear Cache
                </Button>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">💡 Offline Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Recently viewed content is available offline</li>
                <li>• Your decks are saved locally while offline</li>
                <li>• Changes will sync when you're back online</li>
                <li>• Install this app for better offline experience</li>
              </ul>
            </div>

            {/* PWA Install Prompt */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <div className="text-blue-900 font-medium mb-1">📱 Install App</div>
              <div className="text-blue-700 text-sm mb-2">
                Get better offline access and app-like experience
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-700 border-blue-300"
                onClick={() => {
                  // Installation will be handled by the PWA install prompt
                  window.dispatchEvent(new CustomEvent('pwa-install-prompt'));
                }}
              >
                Install App
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}