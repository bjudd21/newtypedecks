'use client';
/**
 * Right panel: proxy sheet preview + export controls
 */

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { MAX_PROXY_QUANTITY, CARDS_PER_PAGE, type ProxyEntry } from '../types';

interface ProxySheetPanelProps {
  proxyEntries: ProxyEntry[];
  totalCards: number;
  isExporting: boolean;
  exportProgress: number;
  onSetQuantity: (cardId: string, qty: number) => void;
  onRemoveCard: (cardId: string) => void;
  onClear: () => void;
  onExport: () => void;
}

export function ProxySheetPanel({
  proxyEntries,
  totalCards,
  isExporting,
  exportProgress,
  onSetQuantity,
  onRemoveCard,
  onClear,
  onExport,
}: ProxySheetPanelProps) {
  const pageCount = Math.ceil(totalCards / CARDS_PER_PAGE);

  return (
    <div className="flex flex-col gap-4">
      {/* Header + actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-lg font-semibold">Proxy Sheet</h2>
          <p className="text-muted-foreground text-xs">
            {totalCards} card{totalCards !== 1 ? 's' : ''} · {pageCount} page
            {pageCount !== 1 ? 's' : ''} · 3×3 per page
          </p>
        </div>
        <div className="flex gap-2">
          {proxyEntries.length > 0 && (
            <Button variant="outline" onClick={onClear}>
              Clear
            </Button>
          )}
          <Button
            variant="primary"
            onClick={onExport}
            disabled={proxyEntries.length === 0 || isExporting}
          >
            {isExporting ? `Exporting... ${exportProgress}%` : 'Export PDF'}
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {proxyEntries.length === 0 && (
        <div className="border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <div className="text-muted-foreground mb-2 text-3xl">🖨</div>
          <p className="text-muted-foreground/70 text-sm">
            Click cards on the left to add them to your proxy sheet.
          </p>
        </div>
      )}

      {/* Card list */}
      {proxyEntries.length > 0 && (
        <div className="flex flex-col gap-2">
          {proxyEntries.map(({ card, quantity }) => (
            <div
              key={card.id}
              className="border-border bg-card flex items-center gap-3 rounded-md border p-2"
            >
              {/* Thumbnail */}
              <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded">
                {(card.imageUrlSmall ?? card.imageUrl) ? (
                  <Image
                    src={(card.imageUrlSmall ?? card.imageUrl) as string}
                    alt={card.name}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                ) : (
                  <div className="bg-background h-full w-full" />
                )}
              </div>

              {/* Name */}
              <span className="text-foreground min-w-0 flex-1 truncate text-sm">
                {card.name}
              </span>

              {/* Quantity stepper */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSetQuantity(card.id, quantity - 1)}
                  className="border-border text-foreground hover:border-primary hover:text-foreground flex h-6 w-6 items-center justify-center rounded border text-sm"
                >
                  −
                </button>
                <span className="text-foreground w-5 text-center text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => onSetQuantity(card.id, quantity + 1)}
                  disabled={quantity >= MAX_PROXY_QUANTITY}
                  className="border-border text-foreground hover:border-primary hover:text-foreground flex h-6 w-6 items-center justify-center rounded border text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => onRemoveCard(card.id)}
                className="text-muted-foreground/70 ml-1 hover:text-red-400"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Export hint */}
      {proxyEntries.length > 0 && (
        <p className="text-muted-foreground/70 text-xs">
          PDF exports US Letter (8.5&quot;×11&quot;) at 2.5&quot;×3.5&quot; per
          card with cut marks. Print at 100% scale — do not fit to page.
        </p>
      )}
    </div>
  );
}
