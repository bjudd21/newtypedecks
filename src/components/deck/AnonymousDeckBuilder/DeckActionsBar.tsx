/**
 * DeckActionsBar Component
 * Action buttons for deck operations
 */

import React from 'react';
import { Button } from '@/components/ui';
import { ExportDropdown } from '../ExportDropdown';

interface DeckActionsBarProps {
  uniqueCards: number;
  onNewDeck: () => void;
  onExport: (format: 'json' | 'text' | 'csv' | 'mtga') => void;
  onShare: () => void;
}

export const DeckActionsBar: React.FC<DeckActionsBarProps> = ({
  uniqueCards,
  onNewDeck,
  onExport,
  onShare,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="outline" onClick={onNewDeck}>
        New Deck
      </Button>

      <ExportDropdown uniqueCards={uniqueCards} onExport={onExport} />

      <Button variant="outline" disabled={uniqueCards === 0} onClick={onShare}>
        🔗 Share via URL
      </Button>

      <Button
        variant="default"
        onClick={() => {
          window.location.href = '/auth/signin?callbackUrl=/decks';
        }}
      >
        🔐 Sign In to Save Permanently
      </Button>
    </div>
  );
};
