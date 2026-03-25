/**
 * CollectionSummaryBar
 * Shows "You own X/Y cards" with a progress bar and an "Export Missing" button.
 * Appears in the deck panel when ownership display is enabled.
 */

'use client';

import React, { useMemo } from 'react';
import type { DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckCardWithCard extends DeckCard {
  card: CardWithRelations;
}

interface CollectionSummaryBarProps {
  deckCards: DeckCardWithCard[];
  collectionQuantities: Record<string, number>;
}

function exportMissingCards(
  deckCards: DeckCardWithCard[],
  collectionQuantities: Record<string, number>
) {
  const lines = deckCards
    .filter((dc) => (collectionQuantities[dc.card.id] ?? 0) < dc.quantity)
    .map((dc) => {
      const owned = collectionQuantities[dc.card.id] ?? 0;
      const needed = dc.quantity - owned;
      return `${needed}x ${dc.card.name}`;
    });

  if (lines.length === 0) return;

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'missing-cards.txt';
  a.click();
  URL.revokeObjectURL(url);
}

export const CollectionSummaryBar: React.FC<CollectionSummaryBarProps> = ({
  deckCards,
  collectionQuantities,
}) => {
  const { totalOwned, totalNeeded, missingCount } = useMemo(() => {
    let owned = 0;
    let needed = 0;
    let missing = 0;

    for (const dc of deckCards) {
      const have = collectionQuantities[dc.card.id] ?? 0;
      needed += dc.quantity;
      owned += Math.min(have, dc.quantity);
      if (have < dc.quantity) missing++;
    }

    return { totalOwned: owned, totalNeeded: needed, missingCount: missing };
  }, [deckCards, collectionQuantities]);

  if (totalNeeded === 0) return null;

  const pct =
    totalNeeded > 0 ? Math.round((totalOwned / totalNeeded) * 100) : 0;
  const allOwned = totalOwned === totalNeeded;

  return (
    <div className="border-border bg-background/50 flex items-center gap-3 rounded border px-3 py-2 text-xs">
      {/* Progress bar */}
      <div className="bg-border h-1.5 flex-1 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full transition-all ${allOwned ? 'bg-green-500' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Label */}
      <span className={allOwned ? 'text-green-400' : 'text-muted-foreground'}>
        <span className={allOwned ? 'text-green-300' : 'text-foreground'}>
          {totalOwned}
        </span>
        /{totalNeeded} owned
      </span>

      {/* Export missing */}
      {missingCount > 0 && (
        <button
          onClick={() => exportMissingCards(deckCards, collectionQuantities)}
          className="border-border text-muted-foreground hover:border-primary hover:text-primary shrink-0 rounded border px-2 py-0.5 transition-colors"
          title={`Export ${missingCount} missing card type(s)`}
        >
          Export missing
        </button>
      )}
    </div>
  );
};
