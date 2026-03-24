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
        className="flex w-full items-center gap-2 text-left text-sm text-gray-400 hover:text-gray-300"
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
              className="flex items-center gap-3 rounded border border-[#443a5c]/50 bg-[#1a1625]/30 px-3 py-2"
            >
              <div className="flex h-10 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-[#443a5c] bg-[#1a1625]">
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
                  <span className="text-xs text-gray-600">IMG</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-[#a89ec7]">
                  {change.cardName}
                </div>
                <div className="text-xs text-gray-500">
                  {change.card.type?.name}
                </div>
              </div>
              <span className="flex-shrink-0 text-xs text-gray-500">
                ×{change.newQuantity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
