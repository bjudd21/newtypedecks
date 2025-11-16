/**
 * Loading state component
 */

import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#8b7aaa]"></div>
      <p className="mt-2 text-gray-400">Loading collection...</p>
    </div>
  );
};
