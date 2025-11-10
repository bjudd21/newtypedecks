/**
 * Advanced Settings Section Component
 * Displays service worker status and advanced controls
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

interface AdvancedSettingsSectionProps {
  pwaState: PWAState;
  actionLoading: string | null;
  onUnregisterSW: () => void;
}

function OfflineFeaturesList({ isActive }: { isActive: boolean }) {
  const features = [
    'Offline page access',
    'Background data sync',
    'Cached resource serving',
    'Offline deck building',
  ];

  return (
    <div className="space-y-2 text-sm">
      {features.map((feature) => (
        <div key={feature} className="flex items-center gap-2">
          <span className={isActive ? 'text-green-600' : 'text-gray-400'}>
            {isActive ? '✓' : '✗'}
          </span>
          <span>{feature}</span>
        </div>
      ))}
    </div>
  );
}

export function AdvancedSettingsSection({
  pwaState,
  actionLoading,
  onUnregisterSW,
}: AdvancedSettingsSectionProps) {
  const isServiceWorkerActive = pwaState.isServiceWorkerRegistered;

  return (
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
              <Badge variant={isServiceWorkerActive ? 'primary' : 'outline'}>
                {isServiceWorkerActive ? 'Active' : 'Inactive'}
              </Badge>
              {isServiceWorkerActive && (
                <Button
                  onClick={onUnregisterSW}
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
            <h4 className="mb-2 font-medium text-gray-900">Offline Features</h4>
            <OfflineFeaturesList isActive={isServiceWorkerActive} />
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <div className="mb-1 font-medium text-yellow-900">⚠️ Warning</div>
            <div className="text-sm text-yellow-700">
              Disabling the service worker will remove all offline
              functionality. You&apos;ll need to refresh the page to re-enable
              offline features.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
