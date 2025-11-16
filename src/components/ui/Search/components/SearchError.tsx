/**
 * Search error component
 */

import React from 'react';

interface SearchErrorProps {
  errorId: string;
  error?: string;
}

export const SearchError: React.FC<SearchErrorProps> = ({ errorId, error }) => {
  if (!error) return null;

  return (
    <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
      {error}
    </p>
  );
};
