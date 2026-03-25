import React from 'react';
import { CardDisplay } from '@/components/card/CardDisplay';
import { Button, Pagination } from '@/components/ui';
import type { CardWithRelations } from '@/lib/types/card';

interface TraditionalPaginationResultsProps {
  cards: CardWithRelations[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCardClick: (card: CardWithRelations) => void;
  onRetry: () => void;
}

export function TraditionalPaginationResults({
  cards,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onCardClick,
  onRetry,
}: TraditionalPaginationResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="animate-pulse rounded-lg border p-4">
            <div className="bg-muted mb-2 h-32 w-full rounded"></div>
            <div className="bg-muted mb-1 h-4 w-3/4 rounded"></div>
            <div className="bg-muted h-3 w-1/2 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="mb-4 text-red-600">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card: CardWithRelations) => (
          <CardDisplay
            key={card.id}
            card={card}
            onClick={onCardClick}
            className="cursor-pointer"
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            disabled={isLoading}
          />
        </div>
      )}
    </>
  );
}
