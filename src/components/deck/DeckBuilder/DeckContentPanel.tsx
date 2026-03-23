/**
 * DeckContentPanel Component
 * Displays deck contents with per-zone sections driven by deckRules.
 * Auto-managed zones (e.g. DON!!) render as static counters, not drop targets.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { DeckDropZone } from '../DeckDropZone';
import { CardListByType } from './CardListByType';
import type { DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';
import type { DeckRules } from '@/lib/types/game';

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
  deckCards?: DeckCardWithCard[];
  deckRules?: DeckRules;
}

/** Group a flat card list by card type name for use in CardListByType. */
function groupByType(
  cards: DeckCardWithCard[]
): Record<string, DeckCardWithCard[]> {
  const groups: Record<string, DeckCardWithCard[]> = {};
  for (const dc of cards) {
    const typeName = dc.card.type?.name ?? 'Unknown';
    if (!groups[typeName]) groups[typeName] = [];
    groups[typeName].push(dc);
  }
  return groups;
}

export const DeckContentPanel: React.FC<DeckContentPanelProps> = ({
  totalCards,
  uniqueCards,
  cardsByType,
  isEditing,
  collectionQuantities,
  onCardDrop,
  onQuantityChange,
  deckCards,
  deckRules,
}) => {
  const zones = deckRules?.zones ?? [];
  const useZoneLayout = zones.length > 0 && deckCards != null;

  return (
    <Card className="border-[#443a5c] bg-[#2d2640]">
      <CardHeader>
        <CardTitle className="text-[#a89ec7]">
          DECK CONTENTS ({totalCards} CARDS)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {useZoneLayout ? (
          zones.map((zone) => {
            if (zone.autoManaged) {
              // Static counter for auto-managed zones (e.g. DON!! Deck)
              return (
                <div
                  key={zone.key}
                  className="rounded border border-[#443a5c] p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#a89ec7]">
                      {zone.label}
                    </span>
                    <span className="rounded bg-[#443a5c] px-2 py-0.5 text-xs text-[#c8b8f0]">
                      {zone.maxSize ?? 0}/{zone.maxSize ?? 0} (auto)
                    </span>
                  </div>
                </div>
              );
            }

            const zoneCards = deckCards.filter(
              (dc) => (dc.category ?? 'main') === zone.key
            );
            const zoneCount = zoneCards.reduce(
              (sum, dc) => sum + dc.quantity,
              0
            );
            const sizeLabel =
              zone.maxSize != null
                ? `${zoneCount}/${zone.maxSize}`
                : String(zoneCount);

            return (
              <div key={zone.key}>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-[#a89ec7]">
                    {zone.label}
                  </span>
                  <span className="rounded bg-[#443a5c] px-2 py-0.5 text-xs text-[#c8b8f0]">
                    {sizeLabel}
                  </span>
                </div>
                <DeckDropZone
                  onCardDrop={onCardDrop}
                  title={zone.label}
                  description={`Drag cards here to add to ${zone.label}`}
                  minHeight={zone.key === 'leader' ? 80 : 200}
                  className={
                    zone.key === 'leader' ? '' : 'max-h-80 overflow-y-auto'
                  }
                >
                  {zoneCards.length === 0 ? null : (
                    <CardListByType
                      cardsByType={groupByType(zoneCards)}
                      isEditing={isEditing}
                      collectionQuantities={collectionQuantities}
                      onQuantityChange={onQuantityChange}
                    />
                  )}
                </DeckDropZone>
              </div>
            );
          })
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};
