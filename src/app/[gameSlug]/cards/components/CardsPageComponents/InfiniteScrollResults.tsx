import React from 'react';
import { CardDisplay } from '@/components/card/CardDisplay';
import { InfiniteScroll } from '@/components/ui';
import type { CardWithRelations } from '@/lib/types/card';

interface InfiniteScrollResultsProps {
  cards: CardWithRelations[];
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  total: number;
  onLoadMore: () => Promise<void>;
  onCardClick: (card: CardWithRelations) => void;
  onRetry: () => void;
}

export function InfiniteScrollResults({
  cards,
  hasMore,
  isLoading,
  error,
  total,
  onLoadMore,
  onCardClick,
  onRetry,
}: InfiniteScrollResultsProps) {
  return (
    <InfiniteScroll
      items={cards}
      hasMore={hasMore}
      isLoading={isLoading}
      loadMore={onLoadMore}
      renderItem={(card: CardWithRelations, _index: number) => (
        <CardDisplay
          key={card.id}
          card={card}
          onClick={onCardClick}
          className="cursor-pointer"
        />
      )}
      renderSkeleton={() => (
        <div className="animate-pulse rounded-lg border p-4">
          <div className="mb-2 h-32 w-full rounded bg-gray-200"></div>
          <div className="mb-1 h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-3 w-1/2 rounded bg-gray-200"></div>
        </div>
      )}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      containerClassName="space-y-4"
      errorMessage={error || undefined}
      onRetry={onRetry}
      endMessage={
        <div className="text-muted-foreground/70 py-8 text-center">
          <svg
            className="mx-auto mb-2 h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <p className="text-sm">
            You&apos;ve seen all {total.toLocaleString()} matching cards
          </p>
        </div>
      }
    />
  );
}
