'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import { socialService, type DeckComment } from '@/lib/services/socialService';
import { useAuth } from '@/hooks';
import {
  CommentCard,
  CommentForm,
  CommentsEmptyState,
  CommentsLoadingState,
} from './DeckComments/';

interface DeckCommentsProps {
  deckId: string;
  className?: string;
}

export const DeckComments: React.FC<DeckCommentsProps> = ({
  deckId,
  className,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<DeckComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalComments, setTotalComments] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadComments();
  }, [deckId]);

  const loadComments = async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await socialService.getDeckComments(deckId, page, 20);

      if (page === 1) {
        setComments(result.comments);
      } else {
        setComments((prev) => [...prev, ...result.comments]);
      }

      setTotalComments(result.totalCount);
      setHasMore(result.comments.length === 20);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreComments = () => {
    if (!isLoading && hasMore) {
      loadComments(currentPage + 1);
    }
  };

  const handleCommentSubmit = async (content: string, parentId?: string) => {
    if (!isAuthenticated || !user) return;

    try {
      const newComment = await socialService.postDeckComment(
        deckId,
        user.id,
        content,
        parentId
      );

      if (parentId) {
        // Add reply to existing comment
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              };
            }
            return comment;
          })
        );
      } else {
        // Add new top-level comment
        setComments((prev) => [newComment, ...prev]);
        setTotalComments((prev) => prev + 1);
      }

      setReplyingTo(null);
      setShowCommentForm(false);
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!isAuthenticated || !user) return;

    try {
      const result = await socialService.toggleCommentLike(commentId, user.id);

      const updateCommentLikes = (comments: DeckComment[]): DeckComment[] =>
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: result.likeCount,
              isLiked: result.isLiked,
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateCommentLikes(comment.replies),
            };
          }
          return comment;
        });

      setComments((prev) => updateCommentLikes(prev));
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

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
              <p className="text-gray-600">{error}</p>
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

export default DeckComments;
