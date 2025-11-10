/**
 * Offline Data Section Component
 * Displays offline decks and sync status
 */

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@/components/ui';
import type { PWAState, OfflineDeck } from '@/lib/services/pwaService';

interface OfflineDataSectionProps {
  offlineDecks: OfflineDeck[];
  pwaState: PWAState;
}

export function OfflineDataSection({
  offlineDecks,
  pwaState,
}: OfflineDataSectionProps) {
  if (offlineDecks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Offline Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">
            <div className="mb-2 text-gray-600">No offline data</div>
            <div className="text-sm text-gray-500">
              Data you create while offline will appear here and sync when
              you&apos;re back online
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Offline Data
          <Badge variant="outline" className="ml-2">
            {offlineDecks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="mb-3 text-sm text-gray-600">
            The following data is stored offline and will sync when you&apos;re
            online:
          </div>
          {offlineDecks.map((deck) => (
            <div
              key={deck.id}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
                  🃏
                </div>
                <div>
                  <div className="font-medium text-gray-900">{deck.name}</div>
                  <div className="text-sm text-gray-600">
                    {deck.cards.length} cards • Created{' '}
                    {deck.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Badge variant={deck.synced ? 'primary' : 'outline'}>
                {deck.synced ? 'Synced' : 'Pending'}
              </Badge>
            </div>
          ))}

          {!pwaState.isOnline && (
            <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3">
              <div className="mb-1 font-medium text-orange-900">
                📡 Currently Offline
              </div>
              <div className="text-sm text-orange-700">
                Data will automatically sync when you reconnect to the internet
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
