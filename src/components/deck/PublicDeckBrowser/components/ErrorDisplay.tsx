/**
 * Error display component
 */

import React from 'react';

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      {error}
    </div>
  );
};
