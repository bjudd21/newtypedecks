/**
 * Empty state component for when no favorites are found
 */

import React from 'react';

interface EmptyStateProps {
  searchQuery: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery }) => {
  return (
    <div className="py-8 text-center text-gray-600">
      <div className="mb-2 text-4xl">♥</div>
      <div className="text-lg font-medium">No favorite decks yet</div>
      <div className="mt-1 text-sm">
        {searchQuery
          ? 'No favorites match your search.'
          : 'Browse decks and templates to add them to your favorites!'}
      </div>
    </div>
  );
};
