/**
 * Image placeholder component
 */

import React from 'react';

interface ImagePlaceholderProps {
  customPlaceholder?: React.ReactNode;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  customPlaceholder,
}) => {
  if (customPlaceholder) {
    return <>{customPlaceholder}</>;
  }

  return (
    <div className="text-muted-foreground bg-muted flex h-full w-full flex-col items-center justify-center">
      <svg
        className="mb-2 h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className="px-2 text-center text-xs">No Image</span>
    </div>
  );
};
