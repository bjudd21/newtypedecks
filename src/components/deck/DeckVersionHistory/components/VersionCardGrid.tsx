/**
 * Version card grid component
 */

import React from 'react';
import Image from 'next/image';
import type { DeckVersion } from '../types';

interface VersionCardGridProps {
  version: DeckVersion;
}

export const VersionCardGrid: React.FC<VersionCardGridProps> = ({
  version,
}) => {
  return (
    <div className="mt-4 border-t pt-4">
      <div className="mb-2 text-sm font-medium text-gray-900">
        Cards in this version:
      </div>
      <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
        {version.cards.map((versionCard) => (
          <div
            key={versionCard.id}
            className="flex items-center gap-2 rounded border bg-white p-2 text-sm"
          >
            {versionCard.card.imageUrl && (
              <Image
                src={versionCard.card.imageUrl}
                alt={versionCard.card.name}
                width={32}
                height={32}
                loading="lazy"
                sizes="32px"
                className="h-8 w-8 rounded object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">
                {versionCard.card.name}
              </div>
              <div className="text-xs text-gray-500">
                {versionCard.card.type.name} • {versionCard.card.rarity.name}
              </div>
            </div>
            <div className="text-xs text-gray-600">x{versionCard.quantity}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
