/**
 * Custom hook for comments event handlers
 */

import { useCallback } from 'react';
import { socialService, type DeckComment } from '@/lib/services/socialService';

interface UseCommentsHandlersOptions {
  deckId: string;
  userId?: string;
  isAuthenticated: boolean;
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  setComments: (comments: DeckComment[] | ((prev: DeckComment[]) => DeckComment[])) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTotalComments: (total: number | ((prev: number) => number)) => void;
  setHasMore: (hasMore: boolean) => void;
  setCurrentPage: (page: number) => void;
  setReplyingTo: (commentId: string | null) => void;
  setShowCommentForm: (show: boolean) => void;
}

export function useCommentsHandlers({
  deckId,
  userId,
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
}: UseCommentsHandlersOptions) {
  const loadComments = useCallback(
    async (page = 1) => {
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
    },
    [deckId, setComments, setIsLoading, setError, setTotalComments, setHasMore, setCurrentPage]
  );

  const loadMoreComments = useCallback(() => {
    if (!isLoading && hasMore) {
      loadComments(currentPage + 1);
    }
  }, [isLoading, hasMore, currentPage, loadComments]);

  const handleCommentSubmit = useCallback(
    async (content: string, parentId?: string) => {
      if (!isAuthenticated || !userId) return;

      try {
        const newComment = await socialService.postDeckComment(
          deckId,
          userId,
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
    },
    [isAuthenticated, userId, deckId, setComments, setTotalComments, setReplyingTo, setShowCommentForm]
  );

  const handleCommentLike = useCallback(
    async (commentId: string) => {
      if (!isAuthenticated || !userId) return;

      try {
        const result = await socialService.toggleCommentLike(commentId, userId);

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
    },
    [isAuthenticated, userId, setComments]
  );

  return {
    loadComments,
    loadMoreComments,
    handleCommentSubmit,
    handleCommentLike,
  };
}
