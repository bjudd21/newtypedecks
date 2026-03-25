/**
 * Loading state component for images
 */

import React from 'react';

interface LoadingStateProps {
  width: number;
  height: number;
  className: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  width,
  height,
  className,
}) => {
  return (
    <div
      className={`bg-muted animate-pulse ${className}`}
      style={{ width, height }}
    />
  );
};
