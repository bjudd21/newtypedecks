/**
 * Empty state component
 */

import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="rounded-lg border border-[#443a5c] bg-[#2d2640]/60 p-12 text-center backdrop-blur-md">
      <p className="text-gray-400">No cards found</p>
      <p className="mt-2 text-sm text-gray-500">
        Create your first card to get started
      </p>
    </div>
  );
};
