/**
 * Skeleton loading grid component
 */

import React from 'react';

interface SkeletonGridProps {
  count?: number;
  className?: string;
  renderSkeleton?: () => React.ReactNode;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  count = 6,
  className = '',
  renderSkeleton,
}) => {
  // Use custom skeleton if provided
  if (renderSkeleton) {
    return (
      <div className={className}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={`skeleton-${index}`}>{renderSkeleton()}</div>
        ))}
      </div>
    );
  }

  // Default skeleton
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="animate-pulse">
          <div className="bg-muted mb-4 h-48 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
};
