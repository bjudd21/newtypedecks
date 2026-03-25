/**
 * DeckContentPanel Component
 * Displays deck contents with per-zone sections driven by deckRules.
 * Auto-managed zones (e.g. DON!!) render as static counters, not drop targets.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { CollectionSummaryBar } from './CollectionSummaryBar';
import { DeckDropZone } from '../DeckDropZone';
import { CardListByType } from './CardListByType';
import { CardListByCategory } from './CardListByCategory';
import { CardListText } from './CardListText';
import { CardListSpreadsheet } from './CardListSpreadsheet';
import { ViewModeToggle, type ViewMode } from './ViewModeToggle';
import { CategoryManager } from './CategoryManager';
import type { DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';
import type { DeckRules } from '@/lib/types/game';
import type { DeckCategory } from '@/lib/types/deck';

interface DeckCardWithCard extends DeckCard {
  card: CardWithRelations;
}

interface DeckContentPanelProps {
  totalCards: number;
  uniqueCards: number;
  cardsByType: Record<string, DeckCardWithCard[]>;
  isEditing: boolean;
  isAuthenticated: boolean;
  collectionQuantities: Record<string, number>;
  onCardDrop: (cardId: string, action: 'move' | 'copy') => void;
  onQuantityChange: (cardId: string, quantity: number) => void;
  deckCards?: DeckCardWithCard[];
  deckRules?: DeckRules;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  categories?: DeckCategory[];
  onCategoriesChange?: (categories: DeckCategory[]) => void;
  onUserCategoryChange?: (cardId: string, userCategory: string | null) => void;
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

/** Render the appropriate card-list view based on viewMode and categories. */
function CardListView({
  cardsByType,
  deckCardsFlat,
  categories,
  isEditing,
  collectionQuantities,
  onQuantityChange,
  onUserCategoryChange,
  viewMode,
  showOwnership,
}: {
  cardsByType: Record<string, DeckCardWithCard[]>;
  deckCardsFlat: DeckCardWithCard[];
  categories: DeckCategory[];
  isEditing: boolean;
  collectionQuantities: Record<string, number>;
  onQuantityChange: (cardId: string, quantity: number) => void;
  onUserCategoryChange?: (cardId: string, userCategory: string | null) => void;
  viewMode: ViewMode;
  showOwnership: boolean;
}) {
  // Use category grouping in image view when categories are configured
  if (viewMode === 'image' && categories.length > 0 && onUserCategoryChange) {
    return (
      <CardListByCategory
        deckCards={deckCardsFlat}
        categories={categories}
        isEditing={isEditing}
        collectionQuantities={collectionQuantities}
        onQuantityChange={onQuantityChange}
        onUserCategoryChange={onUserCategoryChange}
        showOwnership={showOwnership}
      />
    );
  }
  if (viewMode === 'text') {
    return (
      <CardListText
        cardsByType={cardsByType}
        isEditing={isEditing}
        onQuantityChange={onQuantityChange}
        collectionQuantities={collectionQuantities}
        showOwnership={showOwnership}
      />
    );
  }
  if (viewMode === 'spreadsheet') {
    return (
      <CardListSpreadsheet
        cardsByType={cardsByType}
        isEditing={isEditing}
        onQuantityChange={onQuantityChange}
        collectionQuantities={collectionQuantities}
        showOwnership={showOwnership}
      />
    );
  }
  return (
    <CardListByType
      cardsByType={cardsByType}
      isEditing={isEditing}
      collectionQuantities={collectionQuantities}
      onQuantityChange={onQuantityChange}
      showOwnership={showOwnership}
    />
  );
}

export const DeckContentPanel: React.FC<DeckContentPanelProps> = ({
  totalCards,
  uniqueCards,
  cardsByType,
  isEditing,
  isAuthenticated,
  collectionQuantities,
  onCardDrop,
  onQuantityChange,
  deckCards,
  deckRules,
  viewMode = 'image',
  onViewModeChange,
  categories = [],
  onCategoriesChange,
  onUserCategoryChange,
}) => {
  const [showOwnership, setShowOwnership] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const zones = deckRules?.zones ?? [];
  const useZoneLayout = zones.length > 0 && deckCards != null;
  // All cards as a flat list for the summary bar
  const allDeckCards = deckCards ?? Object.values(cardsByType).flat();

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-primary/80">
            DECK CONTENTS ({totalCards} CARDS)
          </CardTitle>
          <div className="flex items-center gap-2">
            {isEditing && onCategoriesChange && (
              <button
                onClick={() => setShowCategoryManager((v) => !v)}
                title="Manage deck categories"
                className={`rounded border px-2 py-1 text-xs transition-colors ${
                  showCategoryManager
                    ? 'border-primary/60 bg-primary/10 text-primary/80'
                    : 'border-border text-muted-foreground/70 hover:text-foreground'
                }`}
              >
                Categories
              </button>
            )}
            {isAuthenticated && (
              <button
                onClick={() => setShowOwnership((v) => !v)}
                title="Toggle collection ownership display"
                className={`rounded border px-2 py-1 text-xs transition-colors ${
                  showOwnership
                    ? 'border-green-500/50 bg-green-500/10 text-green-400'
                    : 'border-border text-muted-foreground/70 hover:text-foreground'
                }`}
              >
                Collection
              </button>
            )}
            {onViewModeChange && (
              <ViewModeToggle viewMode={viewMode} onChange={onViewModeChange} />
            )}
          </div>
        </div>
        {showOwnership && allDeckCards.length > 0 && (
          <div className="mt-2">
            <CollectionSummaryBar
              deckCards={allDeckCards}
              collectionQuantities={collectionQuantities}
            />
          </div>
        )}
        {showCategoryManager && onCategoriesChange && (
          <div className="mt-2">
            <CategoryManager
              categories={categories}
              onChange={onCategoriesChange}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {useZoneLayout ? (
          zones.map((zone) => {
            if (zone.autoManaged) {
              // Static counter for auto-managed zones (e.g. DON!! Deck)
              return (
                <div
                  key={zone.key}
                  className="border-border rounded border p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-primary/80 text-sm font-medium">
                      {zone.label}
                    </span>
                    <span className="bg-border rounded px-2 py-0.5 text-xs text-[#c8b8f0]">
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
                  <span className="text-primary/80 text-sm font-medium">
                    {zone.label}
                  </span>
                  <span className="bg-border rounded px-2 py-0.5 text-xs text-[#c8b8f0]">
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
                    <CardListView
                      cardsByType={groupByType(zoneCards)}
                      deckCardsFlat={zoneCards}
                      categories={categories}
                      isEditing={isEditing}
                      collectionQuantities={collectionQuantities}
                      onQuantityChange={onQuantityChange}
                      onUserCategoryChange={onUserCategoryChange}
                      viewMode={viewMode}
                      showOwnership={showOwnership}
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
              <CardListView
                cardsByType={cardsByType}
                deckCardsFlat={allDeckCards}
                categories={categories}
                isEditing={isEditing}
                collectionQuantities={collectionQuantities}
                onQuantityChange={onQuantityChange}
                onUserCategoryChange={onUserCategoryChange}
                viewMode={viewMode}
                showOwnership={showOwnership}
              />
            )}
          </DeckDropZone>
        )}
      </CardContent>
    </Card>
  );
};
