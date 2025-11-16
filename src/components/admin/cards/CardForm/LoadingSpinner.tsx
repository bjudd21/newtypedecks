/**
 * LoadingSpinner Component
 * Loading state display while fetching reference data
 */

import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex h-96 items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8b7aaa] border-t-transparent" />
  </div>
);
