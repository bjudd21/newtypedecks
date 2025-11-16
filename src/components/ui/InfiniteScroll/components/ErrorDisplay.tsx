/**
 * Error display component for infinite scroll
 */

import React from 'react';
import { Button } from '@/components/ui';

interface ErrorDisplayProps {
  error: string;
  errorMessage?: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  errorMessage,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="mb-4 text-red-600">
        <svg
          className="mx-auto mb-2 h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm">{errorMessage || error}</p>
      </div>
      <Button onClick={onRetry} variant="outline" size="sm">
        Try Again
      </Button>
    </div>
  );
};
