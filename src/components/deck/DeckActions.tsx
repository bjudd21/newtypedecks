/**
 * DeckActions Component
 * Action buttons for deck management (new, save, export, analytics, etc.)
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { ExportDropdown } from './ExportDropdown';

interface DeckActionsProps {
  onNewDeck: () => void;
  isAuthenticated: boolean;
  uniqueCards: number;
  deckLoading: boolean;
  savedDeckId: string | null;
  onSaveDeck: () => void;
  showTemplateCreator: boolean;
  onToggleTemplateCreator: () => void;
  showAnalytics: boolean;
  onToggleAnalytics: () => void;
  onExport: (format: 'json' | 'text' | 'csv' | 'mtga') => void;
}

export const DeckActions: React.FC<DeckActionsProps> = ({
  onNewDeck,
  isAuthenticated,
  uniqueCards,
  deckLoading,
  savedDeckId,
  onSaveDeck,
  showTemplateCreator,
  onToggleTemplateCreator,
  showAnalytics,
  onToggleAnalytics,
  onExport,
}) => (
  <div className="mt-6 flex flex-wrap gap-4">
    <Button variant="outline" onClick={onNewDeck}>
      New Deck
    </Button>

    {isAuthenticated && (
      <Button
        variant="default"
        disabled={uniqueCards === 0 || deckLoading}
        onClick={onSaveDeck}
      >
        {deckLoading ? 'Saving...' : savedDeckId ? 'Update Deck' : 'Save Deck'}
      </Button>
    )}

    {isAuthenticated && savedDeckId && uniqueCards > 0 && (
      <Button variant="outline" onClick={onToggleTemplateCreator}>
        {showTemplateCreator ? 'Hide Template Creator' : 'Create Template'}
      </Button>
    )}

    {uniqueCards > 0 && (
      <Button variant="outline" onClick={onToggleAnalytics}>
        {showAnalytics ? 'Hide Analytics' : '📊 Deck Analytics'}
      </Button>
    )}

    <ExportDropdown uniqueCards={uniqueCards} onExport={onExport} />

    {!isAuthenticated && (
      <Button
        variant="outline"
        onClick={() => {
          console.warn('Sign in to save and share your decks!');
        }}
      >
        💾 Sign in to Save
      </Button>
    )}
  </div>
);
