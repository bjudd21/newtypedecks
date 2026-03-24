'use client';

import React, { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { calculateChanges } from '../DeckVersionComparison/utils';
import { deckToDeckVersion } from './deckAdapter';
import { DeckPicker } from './DeckPicker';
import { DiffSection } from './DiffSection';
import { InCommonSection } from './InCommonSection';
import { ComparisonStats } from './ComparisonStats';
import type { ComparableDeck } from './types';

interface DeckComparisonViewProps {
  initialDeckA: ComparableDeck | null;
  initialDeckB: ComparableDeck | null;
}

export const DeckComparisonView: React.FC<DeckComparisonViewProps> = ({
  initialDeckA,
  initialDeckB,
}) => {
  const router = useRouter();
  const params = useParams<{ gameSlug: string }>();
  const gameSlug = params.gameSlug;

  const [deckA, setDeckA] = useState<ComparableDeck | null>(initialDeckA);
  const [deckB, setDeckB] = useState<ComparableDeck | null>(initialDeckB);

  const updateURL = useCallback(
    (aId: string | null, bId: string | null) => {
      const url = new URL(window.location.href);
      if (aId) url.searchParams.set('a', aId);
      else url.searchParams.delete('a');
      if (bId) url.searchParams.set('b', bId);
      else url.searchParams.delete('b');
      router.replace(url.pathname + url.search);
    },
    [router]
  );

  const handleDeckAChange = useCallback(
    (deck: ComparableDeck) => {
      setDeckA(deck);
      updateURL(deck.id, deckB?.id ?? null);
    },
    [deckB, updateURL]
  );

  const handleDeckBChange = useCallback(
    (deck: ComparableDeck) => {
      setDeckB(deck);
      updateURL(deckA?.id ?? null, deck.id);
    },
    [deckA, updateURL]
  );

  const diff =
    deckA && deckB
      ? calculateChanges(deckToDeckVersion(deckA), deckToDeckVersion(deckB))
      : null;

  const added = diff?.filter((c) => c.type === 'added') ?? [];
  const removed = diff?.filter((c) => c.type === 'removed') ?? [];
  const modified = diff?.filter((c) => c.type === 'modified') ?? [];
  const unchanged = diff?.filter((c) => c.type === 'unchanged') ?? [];
  const hasDiff = added.length > 0 || removed.length > 0 || modified.length > 0;

  return (
    <div className="space-y-6">
      {/* Deck selectors */}
      <div className="rounded-xl border border-[#443a5c] bg-[#2d2640] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <DeckPicker
            value={deckA}
            label="Deck A"
            gameSlug={gameSlug}
            onChange={handleDeckAChange}
          />
          <div className="flex-shrink-0 pt-6 text-center text-lg font-bold text-[#8b7aaa] sm:pt-7">
            vs
          </div>
          <DeckPicker
            value={deckB}
            label="Deck B"
            gameSlug={gameSlug}
            onChange={handleDeckBChange}
          />
        </div>
      </div>

      {/* Stats panel — shown when both decks loaded */}
      {deckA && deckB && <ComparisonStats deckA={deckA} deckB={deckB} />}

      {/* Diff panel */}
      {diff && (
        <div className="space-y-5 rounded-xl border border-[#443a5c] bg-[#2d2640] p-4">
          {!hasDiff && (
            <div className="py-4 text-center text-sm text-gray-400">
              These decks are identical.
            </div>
          )}
          <DiffSection type="added" changes={added} />
          <DiffSection type="removed" changes={removed} />
          <DiffSection type="modified" changes={modified} />
          <InCommonSection changes={unchanged} />
        </div>
      )}

      {/* Empty state */}
      {(!deckA || !deckB) && (
        <div className="rounded-xl border border-dashed border-[#443a5c] bg-[#1a1625]/30 py-16 text-center">
          <div className="mb-3 text-4xl text-[#443a5c]">⚔</div>
          <div className="text-sm text-gray-400">
            {!deckA && !deckB
              ? 'Select two decks above to compare'
              : 'Select a second deck to compare'}
          </div>
        </div>
      )}
    </div>
  );
};
