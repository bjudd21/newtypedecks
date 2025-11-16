/**
 * Error display component
 */

import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-6 rounded border border-red-900/50 bg-red-950/30 px-4 py-3 text-red-400">
      {error}
    </div>
  );
};
