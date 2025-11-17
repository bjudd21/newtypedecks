/**
 * useRatings Custom Hook
 * Manages ratings data loading and state
 */

import { useState, useEffect, useCallback } from 'react';
import { socialService, type DeckRating } from '@/lib/services/socialService';

interface UseRatingsOptions {
  deckId: string;
  userId?: string;
  isAuthenticated: boolean;
}

export const useRatings = ({
  deckId,
  userId,
  isAuthenticated,
}: UseRatingsOptions) => {
  const [ratings, setRatings] = useState<DeckRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState<
    Record<number, number>
  >({});
  const [userRating, setUserRating] = useState<DeckRating | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadRatings = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await socialService.getDeckRatings(deckId, page, 10);

      if (page === 1) {
        setRatings(result.ratings);
      } else {
        setRatings((prev) => [...prev, ...result.ratings]);
      }

      setAverageRating(result.averageRating);
      setTotalRatings(result.totalCount);
      setRatingBreakdown(result.ratingBreakdown);
      setHasMore(result.ratings.length === 10);
      setCurrentPage(page);

      // Check if current user has rated this deck
      if (isAuthenticated && userId) {
        const existingRating = result.ratings.find((r) => r.userId === userId);
        setUserRating(existingRating || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ratings');
    } finally {
      setIsLoading(false);
    }
  }, [deckId, isAuthenticated, userId]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  const loadMoreRatings = () => {
    if (!isLoading && hasMore) {
      loadRatings(currentPage + 1);
    }
  };

  const handleVoteHelpful = async (ratingId: string, isHelpful: boolean) => {
    if (!isAuthenticated || !userId) return;

    try {
      const result = await socialService.voteCommentHelpful(
        ratingId,
        userId,
        isHelpful
      );
      setRatings((prev) =>
        prev.map((rating) =>
          rating.id === ratingId
            ? { ...rating, helpfulVotes: result.helpfulVotes, isHelpful }
            : rating
        )
      );
    } catch (error) {
      console.error('Failed to vote on rating:', error);
    }
  };

  return {
    ratings,
    isLoading,
    error,
    averageRating,
    totalRatings,
    ratingBreakdown,
    userRating,
    hasMore,
    setUserRating,
    loadRatings,
    loadMoreRatings,
    handleVoteHelpful,
  };
};
