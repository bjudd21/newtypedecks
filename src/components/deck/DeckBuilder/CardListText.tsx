/**
 * CardListText — compact text-row view of deck cards, grouped by type.
 * Shows: qty controls (edit mode) | name | type | cost
 */

'use client';

import React from 'react';
import type { DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckCardWithCard extends DeckCard {
  card: CardWithRelations;
}

interface CardListTextProps {
  cardsByType: Record<string, DeckCardWithCard[]>;
  isEditing: boolean;
  onQuantityChange: (cardId: string, quantity: number) => void;
  collectionQuantities?: Record<string, number>;
  showOwnership?: boolean;
}

export const CardListText: React.FC<CardListTextProps> = ({
  cardsByType,
  isEditing,
  onQuantityChange,
  collectionQuantities = {},
  showOwnership = false,
}) => (
  <div className="space-y-3">
    {Object.entries(cardsByType).map(([typeName, cards]) => (
      <div key={typeName}>
        <div className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
          {typeName} ({cards.reduce((s, c) => s + c.quantity, 0)})
        </div>
        <div className="space-y-0.5">
          {cards.map((dc) => (
            <div
              key={dc.cardId}
              className="flex items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-[#3a3050]"
            >
              {isEditing ? (
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => onQuantityChange(dc.cardId, dc.quantity - 1)}
                    className="flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-[#443a5c] hover:text-white"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-[#c8b8f0]">
                    {dc.quantity}
                  </span>
                  <button
                    onClick={() => onQuantityChange(dc.cardId, dc.quantity + 1)}
                    className="flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-[#443a5c] hover:text-white"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              ) : (
                <span className="w-8 shrink-0 text-right text-[#c8b8f0]">
                  {dc.quantity}x
                </span>
              )}
              <span className="min-w-0 flex-1 truncate text-white">
                {dc.card.name}
              </span>
              {showOwnership &&
                (() => {
                  const owned = collectionQuantities[dc.card.id] ?? 0;
                  if (owned >= dc.quantity)
                    return (
                      <span className="shrink-0 text-xs text-green-400">✓</span>
                    );
                  if (owned > 0)
                    return (
                      <span className="shrink-0 text-xs text-yellow-400">
                        {owned}/{dc.quantity}
                      </span>
                    );
                  return (
                    <span className="shrink-0 text-xs text-red-400">✗</span>
                  );
                })()}
              <span className="hidden shrink-0 text-xs text-gray-500 sm:block">
                {dc.card.type?.name ?? '—'}
              </span>
              {dc.card.cost != null && (
                <span className="w-5 shrink-0 text-right text-xs text-gray-400">
                  {dc.card.cost}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
