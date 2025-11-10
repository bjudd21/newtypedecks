/**
 * Cache Management Section Component
 * Displays cache size and management controls
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { pwaService, type PWAState } from '@/lib/services/pwaService';

interface CacheManagementSectionProps {
  pwaState: PWAState;
  actionLoading: string | null;
  onClearCache: () => void;
}

export function CacheManagementSection({
  pwaState,
  actionLoading,
  onClearCache,
}: CacheManagementSectionProps) {
  return (
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
                  onClick={onClearCache}
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
            <h4 className="mb-2 font-medium text-gray-900">Cached Content</h4>
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
  );
}
