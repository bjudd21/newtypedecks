/**
 * DeckContentsPanel Component
 * Main panel displaying deck contents with drag and drop
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@/components/ui';
import { DeckDropZone } from '../DeckDropZone';
import { EmptyDeckState } from './EmptyDeckState';
import { DeckCardsList } from './DeckCardsList';
import type { DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckCardWithCard extends DeckCard {
  card: CardWithRelations;
}

interface DeckContentsPanelProps {
  totalCards: number;
  uniqueCards: number;
  cardsByType: Record<string, DeckCardWithCard[]>;
  isEditing: boolean;
  onCardDrop: (cardId: string, action: 'move' | 'copy') => void;
  onQuantityChange: (cardId: string, quantity: number) => void;
}

export const DeckContentsPanel: React.FC<DeckContentsPanelProps> = ({
  totalCards,
  uniqueCards,
  cardsByType,
  isEditing,
  onCardDrop,
  onQuantityChange,
}) => {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-primary/80 flex items-center gap-2 text-lg">
          DECK CONTENTS
          <Badge className="border-primary/30 bg-primary/20 text-primary/80">
            {totalCards} cards
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DeckDropZone
          onCardDrop={onCardDrop}
          title="Main Deck"
          description="Drag cards here or use search to add them"
          minHeight={400}
          className="max-h-96 overflow-y-auto"
        >
          {uniqueCards === 0 ? (
            <EmptyDeckState />
          ) : (
            <DeckCardsList
              cardsByType={cardsByType}
              isEditing={isEditing}
              onQuantityChange={onQuantityChange}
            />
          )}
        </DeckDropZone>
      </CardContent>
    </Card>
  );
};
