/**
 * PWAStatus - Main component with compact and detailed views
 */

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import { pwaService } from '@/lib/services/pwaService';
import { usePWAState } from './hooks/usePWAState';
import { usePWAHandlers } from './hooks/usePWAHandlers';
import { CompactView } from './components/CompactView';
import { StatusItem } from './components/StatusItem';
import { OfflineFeatures } from './components/OfflineFeatures';
import { OfflineModeAlert } from './components/OfflineModeAlert';
import { LoadingState } from './components/LoadingState';
import type { PWAStatusProps } from './types';

export const PWAStatusComponent: React.FC<PWAStatusProps> = ({
  className,
  showDetails = false,
}) => {
  const { pwaState, isLoading, pendingSync, loadPWAState } = usePWAState();
  const { handleUpdateApp, handleClearCache, handleInstallApp } =
    usePWAHandlers(loadPWAState);

  if (isLoading) {
    return <LoadingState className={className} />;
  }

  // Compact status indicator
  if (!showDetails) {
    return (
      <CompactView
        pwaState={pwaState}
        pendingSync={pendingSync}
        className={className}
      />
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
          <StatusItem
            icon={pwaState.isOnline ? '🌐' : '📡'}
            label="Connection"
          >
            <Badge variant={pwaState.isOnline ? 'primary' : 'outline'}>
              {pwaState.isOnline ? 'Online' : 'Offline'}
            </Badge>
          </StatusItem>

          {/* Installation Status */}
          <StatusItem icon="📱" label="Installation">
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
          </StatusItem>

          {/* Service Worker Status */}
          <StatusItem icon="⚙️" label="Service Worker">
            <Badge
              variant={
                pwaState.isServiceWorkerRegistered ? 'primary' : 'outline'
              }
            >
              {pwaState.isServiceWorkerRegistered ? 'Active' : 'Inactive'}
            </Badge>
          </StatusItem>

          {/* Update Status */}
          {pwaState.updateAvailable && (
            <StatusItem icon="🔄" label="Update Available">
              <Button
                onClick={handleUpdateApp}
                variant="default"
                size="sm"
                className="bg-green-600 text-xs hover:bg-green-700"
              >
                Update App
              </Button>
            </StatusItem>
          )}

          {/* Cache Information */}
          <StatusItem icon="💾" label="Cache Size">
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
          </StatusItem>

          {/* Pending Sync Data */}
          {pendingSync > 0 && (
            <StatusItem icon="🔄" label="Pending Sync">
              <Badge
                variant="outline"
                className="border-orange-300 text-orange-600"
              >
                {pendingSync} items
              </Badge>
            </StatusItem>
          )}

          {/* Offline Features */}
          <OfflineFeatures />

          {/* Quick Actions */}
          {!pwaState.isOnline && <OfflineModeAlert pendingSync={pendingSync} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAStatusComponent;
