/**
 * RatingForm Component
 * Form for submitting or editing a deck rating
 */

import React, { useState } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import { socialService, type DeckRating } from '@/lib/services/socialService';
import { useAuth } from '@/hooks';

interface RatingFormProps {
  deckId: string;
  existingRating?: DeckRating | null;
  onSubmit: (rating: DeckRating) => void;
  onCancel: () => void;
}

export const RatingForm: React.FC<RatingFormProps> = ({
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
            className="w-full rounded-md border border-green-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
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
