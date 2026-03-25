/**
 * DeckCommentsContent - Main component orchestrator
 */

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import { useAuth } from '@/hooks';
import {
  CommentCard,
  CommentForm,
  CommentsEmptyState,
  CommentsLoadingState,
} from './';
import { useCommentsState } from './hooks/useCommentsState';
import { useCommentsHandlers } from './hooks/useCommentsHandlers';
import { useCommentsEffects } from './hooks/useCommentsEffects';
import type { DeckCommentsProps } from './types';

export const DeckCommentsContent: React.FC<DeckCommentsProps> = ({
  deckId,
  className,
}) => {
  const { user, isAuthenticated } = useAuth();

  // State management
  const {
    comments,
    setComments,
    isLoading,
    setIsLoading,
    error,
    setError,
    totalComments,
    setTotalComments,
    showCommentForm,
    setShowCommentForm,
    replyingTo,
    setReplyingTo,
    currentPage,
    setCurrentPage,
    hasMore,
    setHasMore,
  } = useCommentsState();

  // Event handlers
  const {
    loadComments,
    loadMoreComments,
    handleCommentSubmit,
    handleCommentLike,
  } = useCommentsHandlers({
    deckId,
    userId: user?.id,
    isAuthenticated,
    currentPage,
    hasMore,
    isLoading,
    setComments,
    setIsLoading,
    setError,
    setTotalComments,
    setHasMore,
    setCurrentPage,
    setReplyingTo,
    setShowCommentForm,
  });

  // Effects
  useCommentsEffects({
    deckId,
    loadComments,
  });

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Discussion ({totalComments})</CardTitle>
            {isAuthenticated && (
              <Button
                onClick={() => setShowCommentForm(!showCommentForm)}
                variant="default"
                size="sm"
              >
                💬 Add Comment
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Comment Form */}
          {showCommentForm && (
            <CommentForm
              onSubmit={(content) => handleCommentSubmit(content)}
              onCancel={() => setShowCommentForm(false)}
              placeholder="Share your thoughts about this deck..."
            />
          )}

          {/* Comments List */}
          {isLoading && comments.length === 0 ? (
            <CommentsLoadingState />
          ) : error ? (
            <div className="py-8 text-center">
              <div className="mb-4 text-red-600">⚠️</div>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : comments.length === 0 ? (
            <CommentsEmptyState isAuthenticated={isAuthenticated} />
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onLike={handleCommentLike}
                  onReply={(commentId) => setReplyingTo(commentId)}
                  replyingTo={replyingTo}
                  onReplySubmit={(content) =>
                    handleCommentSubmit(content, comment.id)
                  }
                  onReplyCancel={() => setReplyingTo(null)}
                />
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="pt-4 text-center">
                  <Button
                    onClick={loadMoreComments}
                    variant="outline"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Load More Comments'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Sign In Prompt */}
          {!isAuthenticated && (
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
              <div className="mb-2 font-medium text-blue-900">
                Join the Discussion
              </div>
              <div className="mb-3 text-sm text-blue-700">
                Sign in to comment, like posts, and engage with the community
              </div>
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckCommentsContent;
