'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import { useAuth } from '@/hooks';
import {
  RatingOverview,
  UserRatingCard,
  RatingForm,
  RatingsList,
  useRatings,
} from './DeckRatings/';
import type { DeckRating } from '@/lib/services/socialService';

interface DeckRatingsProps {
  deckId: string;
  className?: string;
}

export const DeckRatings: React.FC<DeckRatingsProps> = ({
  deckId,
  className,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showRatingForm, setShowRatingForm] = useState(false);

  const {
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
  } = useRatings({
    deckId,
    userId: user?.id,
    isAuthenticated,
  });

  const handleRatingSubmit = (newRating: DeckRating) => {
    setUserRating(newRating);
    setShowRatingForm(false);
    loadRatings(1); // Refresh ratings
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ratings & Reviews</CardTitle>
            {isAuthenticated && !userRating && (
              <Button
                onClick={() => setShowRatingForm(!showRatingForm)}
                variant="default"
                size="sm"
              >
                Write Review
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Rating Overview */}
          <RatingOverview
            averageRating={averageRating}
            totalRatings={totalRatings}
            ratingBreakdown={ratingBreakdown}
          />

          {/* User's Existing Rating */}
          {userRating && (
            <UserRatingCard
              userRating={userRating}
              onEditClick={() => setShowRatingForm(true)}
            />
          )}

          {/* Rating Form */}
          {showRatingForm && (
            <RatingForm
              deckId={deckId}
              existingRating={userRating}
              onSubmit={handleRatingSubmit}
              onCancel={() => setShowRatingForm(false)}
            />
          )}

          {/* Ratings List */}
          <RatingsList
            ratings={ratings}
            isLoading={isLoading}
            error={error}
            hasMore={hasMore}
            isAuthenticated={isAuthenticated}
            currentUserId={user?.id}
            onVoteHelpful={handleVoteHelpful}
            onLoadMore={loadMoreRatings}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckRatings;
