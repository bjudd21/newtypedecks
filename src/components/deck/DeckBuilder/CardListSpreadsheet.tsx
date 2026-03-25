/**
 * CardListSpreadsheet — sortable table view of deck cards.
 * Flat list (no type grouping). Columns: Name, Qty, Type, Cost, Rarity.
 * Type and Cost are hidden on small screens; Rarity hidden on medium.
 */

'use client';

import React, { useState, useMemo } from 'react';
import type { DeckCard } from '@prisma/client';
import type { CardWithRelations } from '@/lib/types/card';

interface DeckCardWithCard extends DeckCard {
  card: CardWithRelations;
}

type SortKey = 'name' | 'quantity' | 'type' | 'cost' | 'rarity';
type SortDir = 'asc' | 'desc';

interface CardListSpreadsheetProps {
  cardsByType: Record<string, DeckCardWithCard[]>;
  isEditing: boolean;
  onQuantityChange: (cardId: string, quantity: number) => void;
  collectionQuantities?: Record<string, number>;
  showOwnership?: boolean;
}

function SortIndicator({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  if (sortKey !== col)
    return <span className="ml-1 opacity-20 select-none">↕</span>;
  return (
    <span className="ml-1 select-none">{sortDir === 'asc' ? '↑' : '↓'}</span>
  );
}

export const CardListSpreadsheet: React.FC<CardListSpreadsheetProps> = ({
  cardsByType,
  isEditing,
  onQuantityChange,
  collectionQuantities = {},
  showOwnership = false,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('type');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const allCards = useMemo(
    () => Object.values(cardsByType).flat(),
    [cardsByType]
  );

  const sorted = useMemo(() => {
    return [...allCards].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      switch (sortKey) {
        case 'name':
          aVal = a.card.name;
          bVal = b.card.name;
          break;
        case 'quantity':
          aVal = a.quantity;
          bVal = b.quantity;
          break;
        case 'type':
          aVal = a.card.type?.name ?? '';
          bVal = b.card.type?.name ?? '';
          break;
        case 'cost':
          aVal = a.card.cost ?? -1;
          bVal = b.card.cost ?? -1;
          break;
        case 'rarity':
          aVal = a.card.rarity?.name ?? '';
          bVal = b.card.rarity?.name ?? '';
          break;
      }
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [allCards, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const thClass =
    'cursor-pointer select-none px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground';

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className={thClass} onClick={() => handleSort('name')}>
              Name
              <SortIndicator col="name" sortKey={sortKey} sortDir={sortDir} />
            </th>
            <th
              className={`${thClass} w-20 text-center`}
              onClick={() => handleSort('quantity')}
            >
              Qty
              <SortIndicator
                col="quantity"
                sortKey={sortKey}
                sortDir={sortDir}
              />
            </th>
            <th
              className={`${thClass} hidden sm:table-cell`}
              onClick={() => handleSort('type')}
            >
              Type
              <SortIndicator col="type" sortKey={sortKey} sortDir={sortDir} />
            </th>
            <th
              className={`${thClass} hidden w-14 text-center sm:table-cell`}
              onClick={() => handleSort('cost')}
            >
              Cost
              <SortIndicator col="cost" sortKey={sortKey} sortDir={sortDir} />
            </th>
            <th
              className={`${thClass} hidden md:table-cell`}
              onClick={() => handleSort('rarity')}
            >
              Rarity
              <SortIndicator col="rarity" sortKey={sortKey} sortDir={sortDir} />
            </th>
            {showOwnership && (
              <th className={`${thClass} w-14 text-center`}>Own</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sorted.map((dc) => (
            <tr
              key={dc.cardId}
              className="hover:bg-accent border-border border-b"
            >
              <td className="text-foreground px-2 py-1">{dc.card.name}</td>
              <td className="px-2 py-1 text-center">
                {isEditing ? (
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() =>
                        onQuantityChange(dc.cardId, dc.quantity - 1)
                      }
                      className="text-muted-foreground hover:bg-border hover:text-foreground flex h-5 w-5 items-center justify-center rounded"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="text-primary w-4 text-center">
                      {dc.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onQuantityChange(dc.cardId, dc.quantity + 1)
                      }
                      className="text-muted-foreground hover:bg-border hover:text-foreground flex h-5 w-5 items-center justify-center rounded"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-primary">{dc.quantity}x</span>
                )}
              </td>
              <td className="text-muted-foreground hidden px-2 py-1 sm:table-cell">
                {dc.card.type?.name ?? '—'}
              </td>
              <td className="text-muted-foreground hidden px-2 py-1 text-center sm:table-cell">
                {dc.card.cost ?? '—'}
              </td>
              <td className="text-muted-foreground hidden px-2 py-1 md:table-cell">
                {dc.card.rarity?.name ?? '—'}
              </td>
              {showOwnership &&
                (() => {
                  const owned = collectionQuantities[dc.card.id] ?? 0;
                  if (owned >= dc.quantity)
                    return (
                      <td className="px-2 py-1 text-center text-xs text-green-400">
                        ✓ {owned}
                      </td>
                    );
                  if (owned > 0)
                    return (
                      <td className="px-2 py-1 text-center text-xs text-yellow-400">
                        {owned}/{dc.quantity}
                      </td>
                    );
                  return (
                    <td className="px-2 py-1 text-center text-xs text-red-400">
                      ✗
                    </td>
                  );
                })()}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
