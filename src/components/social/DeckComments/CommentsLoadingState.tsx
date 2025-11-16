/**
 * CommentsLoadingState Component
 * Loading spinner display while comments are being fetched
 */

import React from 'react';

export const CommentsLoadingState: React.FC = () => {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-600">Loading comments...</p>
    </div>
  );
};
