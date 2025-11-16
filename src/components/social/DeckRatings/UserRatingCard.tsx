/**
 * UserRatingCard Component
 * Displays the current user's existing rating
 */

import React from 'react';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { StarRating } from './StarRating';
import { formatDate, getRatingText } from './utils';
import type { DeckRating } from '@/lib/services/socialService';

interface UserRatingCardProps {
  userRating: DeckRating;
  onEditClick: () => void;
}

export const UserRatingCard: React.FC<UserRatingCardProps> = ({
  userRating,
  onEditClick,
}) => {
  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="text-xl text-blue-600">👤</div>
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="font-medium text-blue-900">Your Review</span>
              <StarRating rating={userRating.rating} size="text-sm" />
              <Badge variant="secondary" className="text-xs">
                {getRatingText(userRating.rating)}
              </Badge>
            </div>
            {userRating.review && (
              <p className="mb-2 text-sm text-blue-800">{userRating.review}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-blue-600">
              <span>{formatDate(userRating.createdAt)}</span>
              <Button
                onClick={onEditClick}
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
  );
};
