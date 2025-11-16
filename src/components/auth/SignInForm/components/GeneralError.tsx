/**
 * General error display component
 */

import React from 'react';

interface GeneralErrorProps {
  error?: string;
}

export const GeneralError: React.FC<GeneralErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="rounded-lg border border-red-500/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
      {error}
    </div>
  );
};
