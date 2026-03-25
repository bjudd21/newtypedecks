/**
 * StarRating Component
 * Displays star rating visualization
 */

import React from 'react';

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  size?: string;
  onRatingChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  interactive = false,
  size = 'text-lg',
  onRatingChange,
}) => {
  return (
    <div className={`flex ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={
            interactive && onRatingChange
              ? () => onRatingChange(star)
              : undefined
          }
          className={`${interactive ? 'cursor-pointer' : ''} ${
            star <= rating ? 'text-yellow-400' : 'text-foreground'
          } ${interactive ? 'hover:text-yellow-300' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};
