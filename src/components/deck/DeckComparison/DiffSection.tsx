'use client';

import React from 'react';
import Image from 'next/image';
import type { CardChange } from '../DeckVersionComparison/types';

const SECTION_CONFIG = {
  added: {
    label: 'Added',
    color: 'text-green-400',
    border: 'border-green-500/30',
    bg: 'bg-green-500/10',
    badge: 'border-green-500/30 bg-green-500/20 text-green-300',
  },
  removed: {
    label: 'Removed',
    color: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    badge: 'border-red-500/30 bg-red-500/20 text-red-300',
  },
  modified: {
    label: 'Changed',
    color: 'text-yellow-400',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/10',
    badge: 'border-yellow-500/30 bg-yellow-500/20 text-yellow-300',
  },
} as const;

interface DiffSectionProps {
  type: keyof typeof SECTION_CONFIG;
  changes: CardChange[];
}

export const DiffSection: React.FC<DiffSectionProps> = ({ type, changes }) => {
  if (changes.length === 0) return null;

  const config = SECTION_CONFIG[type];
  const totalCards = changes.reduce(
    (sum, c) => sum + (c.newQuantity ?? c.oldQuantity ?? 0),
    0
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${config.color}`}>
          {config.label}
        </span>
        <span className="text-muted-foreground/70 text-xs">
          ({changes.length} unique · {totalCards} total)
        </span>
      </div>
      <div className="space-y-1">
        {changes.map((change) => (
          <div
            key={change.cardId}
            className={`flex items-center gap-3 rounded border ${config.border} ${config.bg} px-3 py-2`}
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
              <div className="text-primary/80 truncate text-sm font-medium">
                {change.cardName}
              </div>
              <div className="text-muted-foreground/70 text-xs">
                {change.card.type?.name}
                {change.card.cost !== undefined
                  ? ` · Cost ${change.card.cost}`
                  : ''}
              </div>
            </div>
            <div className="flex-shrink-0">
              {type === 'added' && (
                <span
                  className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-bold ${config.badge}`}
                >
                  ×{change.newQuantity}
                </span>
              )}
              {type === 'removed' && (
                <span
                  className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-bold ${config.badge}`}
                >
                  ×{change.oldQuantity}
                </span>
              )}
              {type === 'modified' && (
                <span
                  className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-bold ${config.badge}`}
                >
                  {change.oldQuantity} → {change.newQuantity}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
