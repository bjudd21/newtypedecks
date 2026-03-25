/**
 * Error display component for version history
 */

import React from 'react';

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="mb-4 rounded border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-400">
      {error}
    </div>
  );
};
