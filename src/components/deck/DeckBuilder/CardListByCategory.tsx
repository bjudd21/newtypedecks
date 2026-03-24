'use client';
/**
 * CardListByCategory
 * Displays deck cards grouped by user-defined categories.
 * Falls back to "Uncategorized" for cards with no userCategory.
 */

import React from 'react';
import { Badge } from '@/components/ui';
import { DraggableCard } from '../DraggableCard';
import type { DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';
import type { DeckCategory } from '@/lib/types/deck';

interface DeckCardWithCard extends DeckCard {
  card: CardWithRelations;
}

interface CardListByCategoryProps {
  deckCards: DeckCardWithCard[];
  categories: DeckCategory[];
  isEditing: boolean;
  collectionQuantities: Record<string, number>;
  onQuantityChange: (cardId: string, quantity: number) => void;
  onUserCategoryChange: (cardId: string, userCategory: string | null) => void;
  showOwnership?: boolean;
}

const UNCATEGORIZED_KEY = '__uncategorized__';

export const CardListByCategory: React.FC<CardListByCategoryProps> = ({
  deckCards,
  categories,
  isEditing,
  collectionQuantities,
  onQuantityChange,
  onUserCategoryChange,
  showOwnership = false,
}) => {
  // Build ordered bucket list: user-defined categories + uncategorized last
  const buckets: Array<{ key: string; label: string }> = [
    ...categories.sort((a, b) => a.sortOrder - b.sortOrder),
    { key: UNCATEGORIZED_KEY, label: 'Uncategorized' },
  ];

  // Group cards into buckets
  const grouped: Record<string, DeckCardWithCard[]> = {};
  for (const card of deckCards) {
    const key = card.userCategory ?? UNCATEGORIZED_KEY;
    // If userCategory references a deleted category, fall back to uncategorized
    const resolvedKey =
      key !== UNCATEGORIZED_KEY && categories.some((c) => c.key === key)
        ? key
        : UNCATEGORIZED_KEY;
    if (!grouped[resolvedKey]) grouped[resolvedKey] = [];
    grouped[resolvedKey].push(card);
  }

  return (
    <div className="space-y-4">
      {buckets.map(({ key, label }) => {
        const cards = grouped[key] ?? [];
        if (cards.length === 0) return null;
        const total = cards.reduce((sum, c) => sum + c.quantity, 0);

        return (
          <div key={key} className="space-y-2">
            <div className="sticky top-0 flex items-center gap-2 bg-[#2d2640] py-1">
              <Badge variant="secondary" className="text-xs">
                {label}
              </Badge>
              <span className="text-sm text-gray-400">({total} cards)</span>
            </div>

            {cards.map((deckCard) => (
              <DraggableCard
                key={deckCard.cardId}
                card={deckCard.card}
                quantity={deckCard.quantity}
                userCategory={deckCard.userCategory ?? null}
                categories={categories}
                onQuantityChange={(q) => onQuantityChange(deckCard.cardId, q)}
                onRemove={() => onQuantityChange(deckCard.cardId, 0)}
                onUserCategoryChange={
                  isEditing
                    ? (cat) => onUserCategoryChange(deckCard.cardId, cat)
                    : undefined
                }
                isEditing={isEditing}
                ownedQuantity={collectionQuantities[deckCard.card.id] || 0}
                showOwnership={showOwnership}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};
