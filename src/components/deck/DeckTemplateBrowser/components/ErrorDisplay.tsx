/**
 * Error display component
 */

import React from 'react';

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {error}
    </div>
  );
};
