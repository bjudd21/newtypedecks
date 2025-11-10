'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import { socialService, type DeckRating } from '@/lib/services/socialService';
import { useAuth } from '@/hooks';

interface DeckRatingsProps {
  deckId: string;
  className?: string;
}

export const DeckRatings: React.FC<DeckRatingsProps> = ({
  deckId,
  className,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [ratings, setRatings] = useState<DeckRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState<
    Record<number, number>
  >({});
  const [userRating, setUserRating] = useState<DeckRating | null>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadRatings();
  }, [deckId]);

  const loadRatings = async (page = 1) => {
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
      if (isAuthenticated && user) {
        const existingRating = result.ratings.find((r) => r.userId === user.id);
        setUserRating(existingRating || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ratings');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreRatings = () => {
    if (!isLoading && hasMore) {
      loadRatings(currentPage + 1);
    }
  };

  const handleVoteHelpful = async (ratingId: string, isHelpful: boolean) => {
    if (!isAuthenticated || !user) return;

    try {
      const result = await socialService.voteCommentHelpful(
        ratingId,
        user.id,
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const renderStars = (
    rating: number,
    interactive = false,
    size = 'text-lg'
  ) => {
    return (
      <div className={`flex ${size}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-300' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5:
        return 'Excellent';
      case 4:
        return 'Good';
      case 3:
        return 'Average';
      case 2:
        return 'Poor';
      case 1:
        return 'Terrible';
      default:
        return '';
    }
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
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <div className="mb-2">
                {renderStars(Math.round(averageRating), false, 'text-2xl')}
              </div>
              <div className="text-sm text-gray-600">
                Based on {totalRatings} review{totalRatings !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingBreakdown[star] || 0;
                const percentage =
                  totalRatings > 0 ? (count / totalRatings) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-6 text-sm">{star}★</span>
                    <div className="h-2 flex-1 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-sm text-gray-600">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User's Existing Rating */}
          {userRating && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="text-xl text-blue-600">👤</div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-medium text-blue-900">
                        Your Review
                      </span>
                      {renderStars(userRating.rating, false, 'text-sm')}
                      <Badge variant="secondary" className="text-xs">
                        {getRatingText(userRating.rating)}
                      </Badge>
                    </div>
                    {userRating.review && (
                      <p className="mb-2 text-sm text-blue-800">
                        {userRating.review}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-blue-600">
                      <span>{formatDate(userRating.createdAt)}</span>
                      <Button
                        onClick={() => setShowRatingForm(true)}
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs"
                      >
                        Edit Review
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rating Form */}
          {showRatingForm && (
            <RatingForm
              deckId={deckId}
              existingRating={userRating}
              onSubmit={(newRating) => {
                setUserRating(newRating);
                setShowRatingForm(false);
                loadRatings(1); // Refresh ratings
              }}
              onCancel={() => setShowRatingForm(false)}
            />
          )}

          {/* Ratings List */}
          {isLoading && ratings.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Loading ratings...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <div className="mb-4 text-red-600">⚠️</div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : ratings.length === 0 ? (
            <div className="py-8 text-center text-gray-600">
              <div className="mb-2 text-4xl">⭐</div>
              <p className="mb-2 text-lg font-medium">No Reviews Yet</p>
              <p>Be the first to rate this deck!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <Card key={rating.id} className="border-gray-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {rating.userAvatar ? (
                          <Image
                            src={rating.userAvatar}
                            alt={rating.userName}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-bold text-white">
                            {rating.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {rating.userName}
                          </span>
                          {renderStars(rating.rating, false, 'text-sm')}
                          <Badge variant="outline" className="text-xs">
                            {getRatingText(rating.rating)}
                          </Badge>
                        </div>

                        {rating.review && (
                          <p className="mb-3 text-gray-700">{rating.review}</p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{formatDate(rating.createdAt)}</span>
                            {rating.helpfulVotes > 0 && (
                              <span>
                                {rating.helpfulVotes} found this helpful
                              </span>
                            )}
                          </div>

                          {isAuthenticated &&
                            user &&
                            rating.userId !== user.id && (
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() =>
                                    handleVoteHelpful(rating.id, true)
                                  }
                                  variant="outline"
                                  size="sm"
                                  className={`h-7 text-xs ${
                                    rating.isHelpful === true
                                      ? 'bg-green-50 text-green-700'
                                      : ''
                                  }`}
                                >
                                  👍 Helpful
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleVoteHelpful(rating.id, false)
                                  }
                                  variant="outline"
                                  size="sm"
                                  className={`h-7 text-xs ${
                                    rating.isHelpful === false
                                      ? 'bg-red-50 text-red-700'
                                      : ''
                                  }`}
                                >
                                  👎 Not Helpful
                                </Button>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="pt-4 text-center">
                  <Button
                    onClick={loadMoreRatings}
                    variant="outline"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Load More Reviews'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface RatingFormProps {
  deckId: string;
  existingRating?: DeckRating | null;
  onSubmit: (rating: DeckRating) => void;
  onCancel: () => void;
}

const RatingForm: React.FC<RatingFormProps> = ({
  deckId,
  existingRating,
  onSubmit,
  onCancel,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [review, setReview] = useState(existingRating?.review || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user || rating === 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newRating = await socialService.submitDeckRating(
        deckId,
        user.id,
        rating,
        review.trim() || undefined
      );
      onSubmit(newRating);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6 border-green-200 bg-green-50">
      <CardContent className="pt-4">
        <h4 className="mb-4 font-medium text-green-900">
          {existingRating ? 'Edit Your Review' : 'Write a Review'}
        </h4>

        {/* Star Rating */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-green-800">
            Rating *
          </label>
          <div className="flex items-center gap-2">
            <div className="flex text-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`cursor-pointer hover:text-yellow-300 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <span className="ml-2 text-sm text-green-700">
                {rating}/5 -{' '}
                {rating === 5
                  ? 'Excellent'
                  : rating === 4
                    ? 'Good'
                    : rating === 3
                      ? 'Average'
                      : rating === 2
                        ? 'Poor'
                        : 'Terrible'}
              </span>
            )}
          </div>
        </div>

        {/* Written Review */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-green-800">
            Review (Optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your thoughts about this deck... What worked well? Any suggestions for improvement?"
            className="w-full rounded-md border border-green-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
            maxLength={1000}
          />
          <div className="mt-1 text-xs text-green-600">
            {review.length}/1000 characters
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSubmit}
            variant="default"
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting
              ? 'Submitting...'
              : existingRating
                ? 'Update Review'
                : 'Submit Review'}
          </Button>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeckRatings;
