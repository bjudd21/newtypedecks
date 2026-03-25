/**
 * RatingOverview Component
 * Displays average rating and rating breakdown
 */

import React from 'react';
import { StarRating } from './StarRating';

interface RatingOverviewProps {
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: Record<number, number>;
}

export const RatingOverview: React.FC<RatingOverviewProps> = ({
  averageRating,
  totalRatings,
  ratingBreakdown,
}) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="text-center">
        <div className="text-foreground mb-2 text-4xl font-bold">
          {averageRating.toFixed(1)}
        </div>
        <div className="mb-2">
          <StarRating
            rating={Math.round(averageRating)}
            interactive={false}
            size="text-2xl"
          />
        </div>
        <div className="text-muted-foreground text-sm">
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
              <div className="bg-muted h-2 flex-1 rounded-full">
                <div
                  className="h-2 rounded-full bg-yellow-400 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-muted-foreground w-8 text-sm">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
