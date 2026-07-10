/**
 * CardListPane — left pane: game selector, search, and the card
 * thumbnail list. Selecting a card loads it into the editor.
 */

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { AdminCard, AdminGame, PaginationData } from '../types';

interface CardListPaneProps {
  games: AdminGame[];
  selectedGameSlug: string;
  onGameChange: (slug: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  cards: AdminCard[];
  pagination: PaginationData;
  isLoading: boolean;
  selectedCardId: string | null;
  onSelectCard: (card: AdminCard) => void;
  onNewCard: () => void;
  onLoadMore: () => void;
}

export function CardListPane({
  games,
  selectedGameSlug,
  onGameChange,
  search,
  onSearchChange,
  cards,
  pagination,
  isLoading,
  selectedCardId,
  onSelectCard,
  onNewCard,
  onLoadMore,
}: CardListPaneProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-foreground text-sm font-semibold">
          Cards
          {pagination.totalCount > 0 && (
            <span className="text-muted-foreground ml-1.5 font-normal">
              {pagination.totalCount.toLocaleString()}
            </span>
          )}
        </h2>
        <Button size="sm" variant="outline" onClick={onNewCard}>
          New card
        </Button>
      </div>

      {games.length > 1 && (
        <Select
          options={games.map((g) => ({ value: g.slug, label: g.name }))}
          value={selectedGameSlug}
          onChange={onGameChange}
          aria-label="Game"
        />
      )}

      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name…"
        aria-label="Search cards"
      />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {isLoading && cards.length === 0 ? (
          <CardListSkeleton />
        ) : cards.length === 0 ? (
          <p className="text-muted-foreground px-1 py-6 text-sm">
            No cards match — try a different search, or create the first one
            with “New card”.
          </p>
        ) : (
          <>
            <CardThumbGrid
              cards={cards}
              selectedCardId={selectedCardId}
              onSelectCard={onSelectCard}
            />
            {pagination.hasMore && (
              <div className="py-3 text-center">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading…' : 'Load more'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CardThumbGrid({
  cards,
  selectedCardId,
  onSelectCard,
}: {
  cards: AdminCard[];
  selectedCardId: string | null;
  onSelectCard: (card: AdminCard) => void;
}) {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {cards.map((card) => {
        const selected = card.id === selectedCardId;
        return (
          <li key={card.id}>
            <button
              type="button"
              onClick={() => onSelectCard(card)}
              aria-pressed={selected}
              title={`${card.name} (${card.setNumber})`}
              className={cn(
                'focus-visible:ring-ring block w-full rounded-md focus-visible:ring-2 focus-visible:outline-none',
                selected && 'ring-primary ring-2'
              )}
            >
              <span className="bg-card border-border relative block aspect-[5/7] overflow-hidden rounded-md border">
                {card.imageUrlSmall || card.imageUrl ? (
                  <Image
                    src={card.imageUrlSmall || card.imageUrl || ''}
                    alt={card.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground flex h-full items-center justify-center p-1 text-center text-[10px] leading-tight">
                    {card.name}
                  </span>
                )}
              </span>
              <span className="text-muted-foreground mt-0.5 block truncate font-mono text-[10px]">
                {card.setNumber}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function CardListSkeleton() {
  return (
    <ul className="grid grid-cols-3 gap-2" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i}>
          <div className="bg-card border-border aspect-[5/7] animate-pulse rounded-md border" />
          <div className="bg-card mt-1 h-2 w-3/4 animate-pulse rounded" />
        </li>
      ))}
    </ul>
  );
}
