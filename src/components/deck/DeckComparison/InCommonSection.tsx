'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { CardChange } from '../DeckVersionComparison/types';

interface InCommonSectionProps {
  changes: CardChange[];
}

export const InCommonSection: React.FC<InCommonSectionProps> = ({
  changes,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (changes.length === 0) return null;

  const totalCards = changes.reduce((sum, c) => sum + (c.newQuantity ?? 0), 0);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground hover:text-foreground flex w-full items-center gap-2 text-left text-sm"
      >
        <span
          className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
        >
          ▶
        </span>
        <span>
          In both decks ({changes.length} unique · {totalCards} total)
        </span>
      </button>

      {isOpen && (
        <div className="space-y-1 pl-4">
          {changes.map((change) => (
            <div
              key={change.cardId}
              className="border-border/50 bg-background/30 flex items-center gap-3 rounded border px-3 py-2"
            >
              <div className="border-border bg-background flex h-10 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded border">
                {change.card.imageUrl ? (
                  <Image
                    src={change.card.imageUrl}
                    alt={change.cardName}
                    width={32}
                    height={40}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground text-xs">IMG</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-primary/80 truncate text-sm">
                  {change.cardName}
                </div>
                <div className="text-muted-foreground/70 text-xs">
                  {change.card.type?.name}
                </div>
              </div>
              <span className="text-muted-foreground/70 flex-shrink-0 text-xs">
                ×{change.newQuantity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
