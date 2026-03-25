/**
 * Offline data management card component
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@/components/ui';
import type { PWAState, OfflineDeck } from '@/lib/services/pwaService';

interface OfflineDataCardProps {
  pwaState: PWAState;
  offlineDecks: OfflineDeck[];
}

export const OfflineDataCard: React.FC<OfflineDataCardProps> = ({
  pwaState,
  offlineDecks,
}) => {
  return (
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
          <div className="py-6 text-center">
            <div className="text-muted-foreground mb-2">No offline data</div>
            <div className="text-muted-foreground/70 text-sm">
              Data you create while offline will appear here and sync when
              you&apos;re back online
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-muted-foreground mb-3 text-sm">
              The following data is stored offline and will sync when
              you&apos;re online:
            </div>
            {offlineDecks.map((deck) => (
              <div
                key={deck.id}
                className="bg-accent flex items-center justify-between rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded">
                    🃏
                  </div>
                  <div>
                    <div className="text-foreground font-medium">
                      {deck.name}
                    </div>
                    <div className="text-muted-foreground text-sm">
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
              <div className="mt-4 rounded-lg border border-orange-500/30 bg-orange-900/20 p-3">
                <div className="mb-1 font-medium text-orange-900">
                  📡 Currently Offline
                </div>
                <div className="text-sm text-orange-400">
                  Data will automatically sync when you reconnect to the
                  internet
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
