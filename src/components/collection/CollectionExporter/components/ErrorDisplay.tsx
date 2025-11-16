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
    <div className="rounded border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-400">
      {error}
    </div>
  );
};
