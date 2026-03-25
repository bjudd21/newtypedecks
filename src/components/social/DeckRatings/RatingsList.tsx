/**
 * RatingsList Component
 * Container for displaying ratings list with loading/empty states
 */

import React from 'react';
import { Button } from '@/components/ui';
import { RatingCard } from './RatingCard';
import type { DeckRating } from '@/lib/services/socialService';

interface RatingsListProps {
  ratings: DeckRating[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  isAuthenticated: boolean;
  currentUserId?: string;
  onVoteHelpful: (ratingId: string, isHelpful: boolean) => void;
  onLoadMore: () => void;
}

export const RatingsList: React.FC<RatingsListProps> = ({
  ratings,
  isLoading,
  error,
  hasMore,
  isAuthenticated,
  currentUserId,
  onVoteHelpful,
  onLoadMore,
}) => {
  if (isLoading && ratings.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="border-primary mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2"></div>
        <p className="text-muted-foreground text-sm">Loading ratings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="mb-4 text-red-600">⚠️</div>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        <div className="mb-2 text-4xl">⭐</div>
        <p className="mb-2 text-lg font-medium">No Reviews Yet</p>
        <p>Be the first to rate this deck!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <RatingCard
          key={rating.id}
          rating={rating}
          isAuthenticated={isAuthenticated}
          currentUserId={currentUserId}
          onVoteHelpful={onVoteHelpful}
        />
      ))}

      {hasMore && (
        <div className="pt-4 text-center">
          <Button onClick={onLoadMore} variant="outline" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More Reviews'}
          </Button>
        </div>
      )}
    </div>
  );
};
