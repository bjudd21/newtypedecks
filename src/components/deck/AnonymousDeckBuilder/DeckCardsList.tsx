/**
 * DeckCardsList Component
 * Displays deck cards grouped by type
 */

import React from 'react';
import { Badge } from '@/components/ui';
import { DraggableCard } from '../DraggableCard';
import type { DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckCardWithCard extends DeckCard {
  card: CardWithRelations;
}

interface DeckCardsListProps {
  cardsByType: Record<string, DeckCardWithCard[]>;
  isEditing: boolean;
  onQuantityChange: (cardId: string, quantity: number) => void;
}

export const DeckCardsList: React.FC<DeckCardsListProps> = ({
  cardsByType,
  isEditing,
  onQuantityChange,
}) => {
  return (
    <div className="space-y-4">
      {Object.entries(cardsByType).map(([typeName, cards]) => (
        <div key={typeName} className="space-y-2">
          <div className="sticky top-0 z-10 flex items-center gap-2 bg-[#2d2640] py-2">
            <Badge
              variant="secondary"
              className="border-[#8b7aaa]/30 bg-[#8b7aaa]/20 text-xs text-[#a89ec7]"
            >
              {typeName}
            </Badge>
            <span className="text-sm text-gray-400">
              ({cards.reduce((sum, card) => sum + card.quantity, 0)} cards)
            </span>
          </div>

          {cards.map((deckCard) => (
            <DraggableCard
              key={deckCard.cardId}
              card={deckCard.card}
              quantity={deckCard.quantity}
              onQuantityChange={(newQuantity) =>
                onQuantityChange(deckCard.cardId, newQuantity)
              }
              onRemove={() => onQuantityChange(deckCard.cardId, 0)}
              isEditing={isEditing}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
