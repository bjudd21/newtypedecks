/**
 * Error display component
 */

import React from 'react';

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="mb-6 rounded border border-red-500/30 bg-red-900/20 px-4 py-3 text-red-400">
      {error}
    </div>
  );
};
