/**
 * HandSimulator
 * Simulates an opening hand draw using Fisher-Yates shuffle.
 * Supports mulligan (full redraw) and drawing additional cards one at a time.
 */

'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import type { DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckCardWithCard extends DeckCard {
  card: CardWithRelations;
}

interface HandSimulatorProps {
  deckCards: DeckCardWithCard[];
  /** Starting hand size from game config. Defaults to 5. */
  handSize?: number;
}

function buildExpandedDeck(deckCards: DeckCardWithCard[]): CardWithRelations[] {
  const deck: CardWithRelations[] = [];
  for (const dc of deckCards) {
    for (let i = 0; i < dc.quantity; i++) {
      deck.push(dc.card);
    }
  }
  return deck;
}

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const HandSimulator: React.FC<HandSimulatorProps> = ({
  deckCards,
  handSize = 5,
}) => {
  const [hand, setHand] = useState<CardWithRelations[]>([]);
  const [remaining, setRemaining] = useState<CardWithRelations[]>([]);
  const [mulliganCount, setMulliganCount] = useState(0);

  const drawHand = useCallback(
    (isFirstDraw: boolean) => {
      const shuffled = fisherYatesShuffle(buildExpandedDeck(deckCards));
      setHand(shuffled.slice(0, handSize));
      setRemaining(shuffled.slice(handSize));
      if (!isFirstDraw) setMulliganCount((c) => c + 1);
    },
    [deckCards, handSize]
  );

  const drawOne = useCallback(() => {
    if (remaining.length === 0) return;
    setHand((h) => [...h, remaining[0]]);
    setRemaining((r) => r.slice(1));
  }, [remaining]);

  const totalCards = buildExpandedDeck(deckCards).length;
  const hasHand = hand.length > 0;

  return (
    <div className="rounded-lg border border-[#443a5c] bg-[#1a1625]/50 p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#c8b8f0]">
            Hand Simulator
          </h3>
          <p className="text-xs text-gray-500">
            {totalCards} card{totalCards !== 1 ? 's' : ''} · draws {handSize}
            {mulliganCount > 0 &&
              ` · ${mulliganCount} mulligan${mulliganCount > 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          {hasHand && (
            <>
              <button
                onClick={drawOne}
                disabled={remaining.length === 0}
                className="rounded border border-[#443a5c] px-3 py-1 text-xs text-gray-400 transition-colors hover:border-[#8b7aaa] hover:text-[#c8b8f0] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Draw 1
              </button>
              <button
                onClick={() => drawHand(false)}
                className="rounded border border-[#443a5c] px-3 py-1 text-xs text-gray-400 transition-colors hover:border-[#8b7aaa] hover:text-[#c8b8f0]"
              >
                Mulligan
              </button>
            </>
          )}
          <button
            onClick={() => drawHand(!hasHand)}
            className="rounded border border-[#8b7aaa]/50 bg-[#8b7aaa]/10 px-3 py-1 text-xs text-[#c8b8f0] transition-colors hover:bg-[#8b7aaa]/20"
          >
            {hasHand ? 'New Hand' : 'Draw Opening Hand'}
          </button>
        </div>
      </div>

      {/* Hand display */}
      {!hasHand ? (
        <p className="py-6 text-center text-sm text-gray-600">
          Click &ldquo;Draw Opening Hand&rdquo; to simulate your starting hand
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {hand.map((card, i) => (
            <div
              key={`${card.id}-${i}`}
              className="flex flex-col items-center gap-1"
              title={card.name}
            >
              <div className="flex h-24 w-16 items-center justify-center overflow-hidden rounded border border-[#443a5c] bg-gradient-to-br from-[#2d2640] to-[#3a3050]">
                {(card.imageUrlSmall ?? card.imageUrl) ? (
                  <Image
                    src={(card.imageUrlSmall ?? card.imageUrl)!}
                    alt={card.name}
                    width={64}
                    height={96}
                    loading="lazy"
                    sizes="64px"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="px-1 text-center text-[9px] leading-tight text-[#8b7aaa]/70">
                    {card.name}
                  </span>
                )}
              </div>
              <span className="max-w-[64px] truncate text-center text-[9px] text-gray-500">
                {card.name}
              </span>
            </div>
          ))}

          {/* Deck remainder indicator */}
          {remaining.length > 0 && (
            <div
              className="flex flex-col items-center gap-1 opacity-30"
              title={`${remaining.length} cards remaining in deck`}
            >
              <div className="flex h-24 w-16 items-center justify-center rounded border border-dashed border-[#443a5c]">
                <span className="text-xs text-gray-500">
                  {remaining.length}
                </span>
              </div>
              <span className="text-[9px] text-gray-600">left</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
