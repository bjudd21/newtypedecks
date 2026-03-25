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
      className={`text-muted-foreground/70 flex items-center justify-center bg-gray-200 ${className}`}
      style={{ width, height }}
    >
      <span className="text-sm">Failed to load image</span>
    </div>
  );
};
