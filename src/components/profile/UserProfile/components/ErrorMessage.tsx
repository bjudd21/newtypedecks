/**
 * Error message display component
 */

import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="mb-4 rounded border border-red-500/30 bg-red-900/20 px-4 py-3 text-sm text-red-400">
      {message}
    </div>
  );
};
