/**
 * CommentsEmptyState Component
 * Empty state display when there are no comments
 */

import React from 'react';

interface CommentsEmptyStateProps {
  isAuthenticated: boolean;
}

export const CommentsEmptyState: React.FC<CommentsEmptyStateProps> = ({
  isAuthenticated,
}) => {
  return (
    <div className="text-muted-foreground py-8 text-center">
      <div className="mb-2 text-4xl">💬</div>
      <p className="mb-2 text-lg font-medium">No Comments Yet</p>
      <p>Start the discussion about this deck!</p>
      {!isAuthenticated && (
        <p className="mt-2 text-sm">Sign in to leave a comment</p>
      )}
    </div>
  );
};
