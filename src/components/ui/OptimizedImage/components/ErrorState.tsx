/**
 * Error state component for failed image loads
 */

import React from 'react';

interface ErrorStateProps {
  width: number;
  height: number;
  className: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  width,
  height,
  className,
}) => {
  return (
    <div
      className={`text-muted-foreground/70 bg-muted flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <span className="text-sm">Failed to load image</span>
    </div>
  );
};
