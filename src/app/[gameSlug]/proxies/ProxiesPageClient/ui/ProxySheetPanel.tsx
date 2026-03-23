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
          <h2 className="text-lg font-semibold text-white">Proxy Sheet</h2>
          <p className="text-xs text-gray-400">
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
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#443a5c] py-16 text-center">
          <div className="mb-2 text-3xl text-gray-600">🖨</div>
          <p className="text-sm text-gray-500">
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
              className="flex items-center gap-3 rounded-md border border-[#443a5c] bg-[#2d2640] p-2"
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
                  <div className="h-full w-full bg-[#1a1625]" />
                )}
              </div>

              {/* Name */}
              <span className="min-w-0 flex-1 truncate text-sm text-white">
                {card.name}
              </span>

              {/* Quantity stepper */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSetQuantity(card.id, quantity - 1)}
                  className="flex h-6 w-6 items-center justify-center rounded border border-[#443a5c] text-sm text-gray-300 hover:border-[#8b7aaa] hover:text-white"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => onSetQuantity(card.id, quantity + 1)}
                  disabled={quantity >= MAX_PROXY_QUANTITY}
                  className="flex h-6 w-6 items-center justify-center rounded border border-[#443a5c] text-sm text-gray-300 hover:border-[#8b7aaa] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => onRemoveCard(card.id)}
                className="ml-1 text-gray-500 hover:text-red-400"
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
        <p className="text-xs text-gray-500">
          PDF exports US Letter (8.5&quot;×11&quot;) at 2.5&quot;×3.5&quot; per
          card with cut marks. Print at 100% scale — do not fit to page.
        </p>
      )}
    </div>
  );
}
