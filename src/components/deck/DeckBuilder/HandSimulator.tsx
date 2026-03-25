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
    <div className="border-border bg-background/50 rounded-lg border p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#c8b8f0]">
            Hand Simulator
          </h3>
          <p className="text-muted-foreground/70 text-xs">
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
                className="border-border text-muted-foreground hover:border-primary rounded border px-3 py-1 text-xs transition-colors hover:text-[#c8b8f0] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Draw 1
              </button>
              <button
                onClick={() => drawHand(false)}
                className="border-border text-muted-foreground hover:border-primary rounded border px-3 py-1 text-xs transition-colors hover:text-[#c8b8f0]"
              >
                Mulligan
              </button>
            </>
          )}
          <button
            onClick={() => drawHand(!hasHand)}
            className="border-primary/50 bg-primary/10 hover:bg-primary/20 rounded border px-3 py-1 text-xs text-[#c8b8f0] transition-colors"
          >
            {hasHand ? 'New Hand' : 'Draw Opening Hand'}
          </button>
        </div>
      </div>

      {/* Hand display */}
      {!hasHand ? (
        <p className="text-muted-foreground py-6 text-center text-sm">
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
              <div className="border-border from-card to-accent flex h-24 w-16 items-center justify-center overflow-hidden rounded border bg-gradient-to-br">
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
                  <span className="text-primary/70 px-1 text-center text-[9px] leading-tight">
                    {card.name}
                  </span>
                )}
              </div>
              <span className="text-muted-foreground/70 max-w-[64px] truncate text-center text-[9px]">
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
              <div className="border-border flex h-24 w-16 items-center justify-center rounded border border-dashed">
                <span className="text-muted-foreground/70 text-xs">
                  {remaining.length}
                </span>
              </div>
              <span className="text-muted-foreground text-[9px]">left</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
