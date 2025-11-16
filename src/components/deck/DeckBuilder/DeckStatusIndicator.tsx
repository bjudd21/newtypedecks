/**
 * DeckStatusIndicator Component
 * Displays the save status and version of the current deck
 */

import React from 'react';
import { Badge } from '@/components/ui';

interface DeckStatusIndicatorProps {
  isAuthenticated: boolean;
  savedDeckId: string | null;
  deckName: string;
  uniqueCards: number;
  currentVersion?: number;
}

export const DeckStatusIndicator: React.FC<DeckStatusIndicatorProps> = ({
  isAuthenticated,
  savedDeckId,
  deckName,
  uniqueCards,
  currentVersion,
}) => {
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mt-4 text-sm text-gray-600">
      {savedDeckId ? (
        <span className="flex items-center gap-1">
          ✅ <strong>{deckName}</strong> is saved to your collection
          {currentVersion && (
            <Badge variant="secondary" className="ml-2 text-xs">
              v{currentVersion}
            </Badge>
          )}
        </span>
      ) : uniqueCards > 0 ? (
        <span className="flex items-center gap-1">
          ⚠️ <strong>{deckName}</strong> has unsaved changes
        </span>
      ) : (
        <span>Start adding cards to build your deck</span>
      )}
    </div>
  );
};
