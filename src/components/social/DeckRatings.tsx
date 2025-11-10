'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { socialService, type DeckRating } from '@/lib/services/socialService';
import { useAuth } from '@/hooks';

interface DeckRatingsProps {
  deckId: string;
  className?: string;
}

export const DeckRatings: React.FC<DeckRatingsProps> = ({
  deckId,
  className
}) => {
  const { user, isAuthenticated } = useAuth();
  const [ratings, setRatings] = useState<DeckRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState<Record<number, number>>({});
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
        setRatings(prev => [...prev, ...result.ratings]);
      }

      setAverageRating(result.averageRating);
      setTotalRatings(result.totalCount);
      setRatingBreakdown(result.ratingBreakdown);
      setHasMore(result.ratings.length === 10);
      setCurrentPage(page);

      // Check if current user has rated this deck
      if (isAuthenticated && user) {
        const existingRating = result.ratings.find(r => r.userId === user.id);
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
      const result = await socialService.voteCommentHelpful(ratingId, user.id, isHelpful);
      setRatings(prev =>
        prev.map(rating =>
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
      day: 'numeric'
    }).format(date);
  };

  const renderStars = (rating: number, interactive = false, size = 'text-lg') => {
    return (
      <div className={`flex ${size}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer ${
              star <= rating
                ? 'text-yellow-400'
                : 'text-gray-300'
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
      case 5: return 'Excellent';
      case 4: return 'Good';
      case 3: return 'Average';
      case 2: return 'Poor';
      case 1: return 'Terrible';
      default: return '';
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
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
                const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm w-6">{star}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User's Existing Rating */}
          {userRating && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 text-xl">👤</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-blue-900">Your Review</span>
                      {renderStars(userRating.rating, false, 'text-sm')}
                      <Badge variant="secondary" className="text-xs">
                        {getRatingText(userRating.rating)}
                      </Badge>
                    </div>
                    {userRating.review && (
                      <p className="text-blue-800 text-sm mb-2">{userRating.review}</p>
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
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading ratings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">⚠️</div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : ratings.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <div className="text-4xl mb-2">⭐</div>
              <p className="text-lg font-medium mb-2">No Reviews Yet</p>
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
                          <img
                            src={rating.userAvatar}
                            alt={rating.userName}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                            {rating.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{rating.userName}</span>
                          {renderStars(rating.rating, false, 'text-sm')}
                          <Badge variant="outline" className="text-xs">
                            {getRatingText(rating.rating)}
                          </Badge>
                        </div>

                        {rating.review && (
                          <p className="text-gray-700 mb-3">{rating.review}</p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{formatDate(rating.createdAt)}</span>
                            {rating.helpfulVotes > 0 && (
                              <span>{rating.helpfulVotes} found this helpful</span>
                            )}
                          </div>

                          {isAuthenticated && user && rating.userId !== user.id && (
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleVoteHelpful(rating.id, true)}
                                variant="outline"
                                size="sm"
                                className={`h-7 text-xs ${
                                  rating.isHelpful === true ? 'bg-green-50 text-green-700' : ''
                                }`}
                              >
                                👍 Helpful
                              </Button>
                              <Button
                                onClick={() => handleVoteHelpful(rating.id, false)}
                                variant="outline"
                                size="sm"
                                className={`h-7 text-xs ${
                                  rating.isHelpful === false ? 'bg-red-50 text-red-700' : ''
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
                <div className="text-center pt-4">
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
  onCancel
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
    <Card className="mb-6 bg-green-50 border-green-200">
      <CardContent className="pt-4">
        <h4 className="font-medium text-green-900 mb-4">
          {existingRating ? 'Edit Your Review' : 'Write a Review'}
        </h4>

        {/* Star Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-green-800 mb-2">
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
              <span className="text-sm text-green-700 ml-2">
                {rating}/5 - {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Terrible'}
              </span>
            )}
          </div>
        </div>

        {/* Written Review */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-green-800 mb-2">
            Review (Optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your thoughts about this deck... What worked well? Any suggestions for improvement?"
            className="w-full px-3 py-2 border border-green-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
            maxLength={1000}
          />
          <div className="text-xs text-green-600 mt-1">
            {review.length}/1000 characters
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
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
            {isSubmitting ? 'Submitting...' : existingRating ? 'Update Review' : 'Submit Review'}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeckRatings;