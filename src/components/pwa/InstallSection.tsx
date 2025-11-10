/**
 * Install Section Component
 * Displays PWA installation status and controls
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
import type { PWAState } from '@/lib/services/pwaService';

interface InstallSectionProps {
  pwaState: PWAState;
  actionLoading: string | null;
  onInstall: () => void;
  onUpdate: () => void;
}

export function InstallSection({
  pwaState,
  actionLoading,
  onInstall,
  onUpdate,
}: InstallSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>App Installation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pwaState.isInstalled ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="primary"
                  className="bg-green-100 text-green-800"
                >
                  ✓ Installed
                </Badge>
                <span className="text-gray-700">
                  App is installed and running
                </span>
              </div>
            </div>
          ) : pwaState.isInstallable ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 font-medium text-gray-900">
                  Install as App
                </div>
                <div className="text-sm text-gray-600">
                  Install the Gundam Card Game Database as a native app for
                  better performance and offline access
                </div>
              </div>
              <Button
                onClick={onInstall}
                variant="default"
                disabled={actionLoading === 'install'}
              >
                {actionLoading === 'install' ? 'Installing...' : 'Install App'}
              </Button>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="mb-2 text-gray-600">
                App installation not available
              </div>
              <div className="text-sm text-gray-500">
                Try using a supported browser or check if the app is already
                installed
              </div>
            </div>
          )}

          {pwaState.updateAvailable && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1 font-medium text-green-900">
                    Update Available
                  </div>
                  <div className="text-sm text-green-700">
                    A new version of the app is available with improvements and
                    bug fixes
                  </div>
                </div>
                <Button
                  onClick={onUpdate}
                  variant="default"
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
  );
}
