/**
 * SearchPanel Component
 * Card search and validation panel for deck building
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { DeckCardSearch } from '../DeckCardSearch';
import { DeckValidator } from '../DeckValidator';
import type { CardWithRelations } from '@/lib/types/card';
import type { DeckCard } from '@prisma/client';

interface DeckCardWithCard extends DeckCard {
  card: CardWithRelations;
}

interface SearchPanelProps {
  onCardSelect: (card: CardWithRelations) => void;
  onSearchResults: (cards: CardWithRelations[]) => void;
  deckCards: DeckCardWithCard[];
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  onCardSelect,
  onSearchResults,
  deckCards,
}) => {
  return (
    <>
      <Card className="border-[#443a5c] bg-[#2d2640]">
        <CardHeader>
          <CardTitle className="text-[#a89ec7]">ADD CARDS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <DeckCardSearch
              onCardSelect={onCardSelect}
              onSearchResults={onSearchResults}
              placeholder="Search cards to add to deck..."
              showFilters={false}
              limit={10}
            />
            <div className="text-sm text-gray-400">
              Click or drag cards to add them to your deck. Cards will be added
              to the main deck by default.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deck Validation */}
      <div className="mt-6">
        <DeckValidator
          cards={deckCards.map((deckCard) => ({
            card: deckCard.card,
            quantity: deckCard.quantity,
            category: deckCard.category || 'main',
          }))}
          showDetails={false}
          onlyErrors={true}
        />
      </div>
    </>
  );
};
