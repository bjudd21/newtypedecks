'use client';

import React from 'react';
import { Badge } from '@/components/ui';

interface CompetitiveRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const CompetitiveRating: React.FC<CompetitiveRatingProps> = ({
  rating,
  size = 'md',
  showLabel = true,
  className
}) => {
  const getRatingTier = (rating: number) => {
    if (rating >= 90) return { tier: 'S', label: 'Competitive', color: 'bg-purple-600 text-white' };
    if (rating >= 80) return { tier: 'A', label: 'Strong', color: 'bg-green-600 text-white' };
    if (rating >= 70) return { tier: 'B', label: 'Good', color: 'bg-blue-600 text-white' };
    if (rating >= 60) return { tier: 'C', label: 'Average', color: 'bg-yellow-600 text-white' };
    if (rating >= 50) return { tier: 'D', label: 'Below Average', color: 'bg-orange-600 text-white' };
    return { tier: 'F', label: 'Needs Work', color: 'bg-red-600 text-white' };
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return { container: 'text-sm', tier: 'text-lg', rating: 'text-xs' };
      case 'md': return { container: 'text-base', tier: 'text-2xl', rating: 'text-sm' };
      case 'lg': return { container: 'text-lg', tier: 'text-3xl', rating: 'text-base' };
      default: return { container: 'text-base', tier: 'text-2xl', rating: 'text-sm' };
    }
  };

  const { tier, label, color } = getRatingTier(rating);
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <div className={`
          rounded-full w-12 h-12 flex items-center justify-center font-bold
          ${color}
          ${size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'}
        `}>
          <span className={sizeClasses.tier}>{tier}</span>
        </div>

        <div className={sizeClasses.container}>
          <div className="font-semibold">{rating}/100</div>
          {showLabel && (
            <div className={`text-gray-600 ${sizeClasses.rating}`}>{label}</div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex-1 max-w-32">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              rating >= 90 ? 'bg-purple-600' :
              rating >= 80 ? 'bg-green-600' :
              rating >= 70 ? 'bg-blue-600' :
              rating >= 60 ? 'bg-yellow-600' :
              rating >= 50 ? 'bg-orange-600' : 'bg-red-600'
            }`}
            style={{ width: `${Math.min(rating, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CompetitiveRating;