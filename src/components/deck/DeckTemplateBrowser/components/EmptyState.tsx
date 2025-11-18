/**
 * Empty state component when no templates found
 */

import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="py-8 text-center text-gray-600">
      <div className="text-lg font-medium">No templates found</div>
      <div className="mt-1 text-sm">
        Try adjusting your search criteria or check back later for new
        templates.
      </div>
    </div>
  );
};
