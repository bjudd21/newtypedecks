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
    <Card className="border-border bg-accent mb-6">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="text-primary text-xl">👤</div>
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-foreground font-medium">Your Review</span>
              <StarRating rating={userRating.rating} size="text-sm" />
              <Badge variant="secondary" className="text-xs">
                {getRatingText(userRating.rating)}
              </Badge>
            </div>
            {userRating.review && (
              <p className="text-muted-foreground mb-2 text-sm">
                {userRating.review}
              </p>
            )}
            <div className="text-primary flex items-center gap-4 text-xs">
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
