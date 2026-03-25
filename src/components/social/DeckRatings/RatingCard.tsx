/**
 * RatingCard Component
 * Displays an individual user rating with voting options
 */

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { StarRating } from './StarRating';
import { formatDate, getRatingText } from './utils';
import type { DeckRating } from '@/lib/services/socialService';

interface RatingCardProps {
  rating: DeckRating;
  isAuthenticated: boolean;
  currentUserId?: string;
  onVoteHelpful: (ratingId: string, isHelpful: boolean) => void;
}

export const RatingCard: React.FC<RatingCardProps> = ({
  rating,
  isAuthenticated,
  currentUserId,
  onVoteHelpful,
}) => {
  return (
    <Card className="border-border">
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
              <div className="text-foreground flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-bold">
                {rating.userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-foreground font-medium">
                {rating.userName}
              </span>
              <StarRating rating={rating.rating} size="text-sm" />
              <Badge variant="outline" className="text-xs">
                {getRatingText(rating.rating)}
              </Badge>
            </div>

            {rating.review && (
              <p className="text-muted-foreground mb-3">{rating.review}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <span>{formatDate(rating.createdAt)}</span>
                {rating.helpfulVotes > 0 && (
                  <span>{rating.helpfulVotes} found this helpful</span>
                )}
              </div>

              {isAuthenticated &&
                currentUserId &&
                rating.userId !== currentUserId && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onVoteHelpful(rating.id, true)}
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
                      onClick={() => onVoteHelpful(rating.id, false)}
                      variant="outline"
                      size="sm"
                      className={`h-7 text-xs ${
                        rating.isHelpful === false
                          ? 'bg-red-900/20 text-red-400'
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
  );
};
