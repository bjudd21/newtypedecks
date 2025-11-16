/**
 * Empty state component
 */

import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="rounded-lg border border-[#443a5c] bg-[#2d2640]/60 p-12 text-center backdrop-blur-md">
      <p className="text-gray-400">No users found</p>
      <p className="mt-2 text-sm text-gray-500">
        Try adjusting your search or filters
      </p>
    </div>
  );
};
