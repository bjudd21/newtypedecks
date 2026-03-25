/**
 * LoadingSpinner Component
 * Loading state display while fetching reference data
 */

import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex h-96 items-center justify-center">
    <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
  </div>
);
