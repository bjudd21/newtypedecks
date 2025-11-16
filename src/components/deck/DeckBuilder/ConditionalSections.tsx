/**
 * ConditionalSections Component
 * Renders optional sections: Version History, Template Creator, and Analytics
 */

import React from 'react';
import { DeckVersionHistory } from '../DeckVersionHistory';
import { DeckTemplateCreator } from '../DeckTemplateCreator';
import { DeckAnalyticsDisplay } from '@/components/analytics';
import type { Deck, DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckWithCards extends Deck {
  cards: (DeckCard & { card: CardWithRelations })[];
}

interface ConditionalSectionsProps {
  showVersionHistory: boolean;
  showTemplateCreator: boolean;
  showAnalytics: boolean;
  isAuthenticated: boolean;
  savedDeckId: string | null;
  currentDeck: DeckWithCards | null;
  deckName: string;
  deckDescription: string;
  totalCards: number;
  currentVersion?: number;
  onTemplateCreated: (templateId: string) => void;
  onAnalysisUpdate: (analytics: unknown) => void;
}

export const ConditionalSections: React.FC<ConditionalSectionsProps> = ({
  showVersionHistory,
  showTemplateCreator,
  showAnalytics,
  isAuthenticated,
  savedDeckId,
  currentDeck,
  deckName,
  deckDescription,
  totalCards,
  currentVersion,
  onTemplateCreated,
  onAnalysisUpdate,
}) => {
  return (
    <>
      {/* Version History Section */}
      {showVersionHistory && isAuthenticated && savedDeckId && (
        <div className="mt-6">
          <DeckVersionHistory
            deckId={savedDeckId}
            currentVersion={currentVersion}
            onVersionRestore={() => {
              // Refresh the page to show restored deck
              window.location.reload();
            }}
            onVersionDelete={() => {
              // Version deleted, refresh might be needed
              console.warn('Version deleted');
            }}
          />
        </div>
      )}

      {/* Template Creator Section */}
      {showTemplateCreator && isAuthenticated && savedDeckId && (
        <div className="mt-6">
          <DeckTemplateCreator
            deckId={savedDeckId}
            deckName={deckName}
            deckDescription={deckDescription}
            cardCount={totalCards}
            onTemplateCreated={onTemplateCreated}
          />
        </div>
      )}

      {/* Deck Analytics Section */}
      {showAnalytics && currentDeck && currentDeck.cards.length > 0 && (
        <div className="mt-6">
          <DeckAnalyticsDisplay
            deckCards={currentDeck.cards.map(
              (deckCard: DeckCard & { card: CardWithRelations }) => ({
                card: deckCard.card,
                quantity: deckCard.quantity,
                category:
                  (deckCard.category as 'main' | 'side' | 'extra' | undefined) ||
                  'main',
              })
            )}
            deckName={deckName}
            onAnalysisUpdate={onAnalysisUpdate}
          />
        </div>
      )}
    </>
  );
};
