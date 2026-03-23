/**
 * CardListByType Component
 * Displays deck cards grouped by type with collapsible sections
 */

import React from 'react';
import { Badge } from '@/components/ui';
import { DraggableCard } from '../DraggableCard';
import type { DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckCardWithCard extends DeckCard {
  card: CardWithRelations;
}

interface CardListByTypeProps {
  cardsByType: Record<string, DeckCardWithCard[]>;
  isEditing: boolean;
  collectionQuantities: Record<string, number>;
  onQuantityChange: (cardId: string, quantity: number) => void;
  showOwnership?: boolean;
}

export const CardListByType: React.FC<CardListByTypeProps> = ({
  cardsByType,
  isEditing,
  collectionQuantities,
  onQuantityChange,
  showOwnership = false,
}) => {
  return (
    <div className="space-y-4">
      {Object.entries(cardsByType).map(([typeName, cards]) => (
        <div key={typeName} className="space-y-2">
          <div className="sticky top-0 flex items-center gap-2 bg-[#2d2640] py-1">
            <Badge variant="secondary" className="text-xs">
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
              ownedQuantity={collectionQuantities[deckCard.card.id] || 0}
              showOwnership={showOwnership}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
