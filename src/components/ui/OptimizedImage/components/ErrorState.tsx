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
      className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
      style={{ width, height }}
    >
      <span className="text-sm">Failed to load image</span>
    </div>
  );
};
