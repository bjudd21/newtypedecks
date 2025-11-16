'use client';

import React from 'react';
import { useSorting } from './hooks/useSorting';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { TableHeader } from './components/TableHeader';
import { TableRow } from './components/TableRow';
import type { CardTableProps } from './types';

export function CardTableComponent({
  cards,
  onEdit,
  onDelete,
  isLoading,
}: CardTableProps) {
  const { sortField, sortOrder, sortedCards, handleSort } = useSorting(cards);

  if (isLoading) {
    return <LoadingState />;
  }

  if (cards.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#443a5c] bg-[#2d2640]/60 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <tbody className="divide-y divide-[#443a5c]">
            {sortedCards.map((card) => (
              <TableRow
                key={card.id}
                card={card}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CardTableComponent;
