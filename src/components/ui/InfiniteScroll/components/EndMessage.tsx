/**
 * End of results message component
 */

import React from 'react';

interface EndMessageProps {
  customMessage?: React.ReactNode;
}

export const EndMessage: React.FC<EndMessageProps> = ({ customMessage }) => {
  if (customMessage) {
    return <div className="flex justify-center py-8">{customMessage}</div>;
  }

  return (
    <div className="flex justify-center py-8">
      <div className="text-center text-gray-500">
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
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
        <p className="text-sm">You&apos;ve reached the end of the results</p>
      </div>
    </div>
  );
};
