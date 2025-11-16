/**
 * DeckContentPanel Component
 * Displays the main deck contents with drag-and-drop support
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { DeckDropZone } from '../DeckDropZone';
import { CardListByType } from './CardListByType';
import type { DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckCardWithCard extends DeckCard {
  card: CardWithRelations;
}

interface DeckContentPanelProps {
  totalCards: number;
  uniqueCards: number;
  cardsByType: Record<string, DeckCardWithCard[]>;
  isEditing: boolean;
  collectionQuantities: Record<string, number>;
  onCardDrop: (cardId: string, action: 'move' | 'copy') => void;
  onQuantityChange: (cardId: string, quantity: number) => void;
}

export const DeckContentPanel: React.FC<DeckContentPanelProps> = ({
  totalCards,
  uniqueCards,
  cardsByType,
  isEditing,
  collectionQuantities,
  onCardDrop,
  onQuantityChange,
}) => {
  return (
    <Card className="border-[#443a5c] bg-[#2d2640]">
      <CardHeader>
        <CardTitle className="text-[#a89ec7]">
          DECK CONTENTS ({totalCards} CARDS)
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
          {uniqueCards === 0 ? null : (
            <CardListByType
              cardsByType={cardsByType}
              isEditing={isEditing}
              collectionQuantities={collectionQuantities}
              onQuantityChange={onQuantityChange}
            />
          )}
        </DeckDropZone>
      </CardContent>
    </Card>
  );
};
