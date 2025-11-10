'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import { socialService, type DeckComment } from '@/lib/services/socialService';
import { useAuth } from '@/hooks';

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

  const _formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
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
            <div className="py-8 text-center">
              <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Loading comments...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <div className="mb-4 text-red-600">⚠️</div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center text-gray-600">
              <div className="mb-2 text-4xl">💬</div>
              <p className="mb-2 text-lg font-medium">No Comments Yet</p>
              <p>Start the discussion about this deck!</p>
              {!isAuthenticated && (
                <p className="mt-2 text-sm">Sign in to leave a comment</p>
              )}
            </div>
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

interface CommentCardProps {
  comment: DeckComment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string) => void;
  replyingTo: string | null;
  onReplySubmit: (content: string) => void;
  onReplyCancel: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onLike,
  onReply,
  replyingTo,
  onReplySubmit,
  onReplyCancel,
}) => {
  const { isAuthenticated } = useAuth();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="border-l-2 border-gray-100 pl-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.userAvatar ? (
            <Image
              src={comment.userAvatar}
              alt={comment.userName}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-bold text-white">
              {comment.userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {comment.userName}
            </span>
            {comment.isPinned && (
              <Badge variant="secondary" className="text-xs">
                📌 Pinned
              </Badge>
            )}
            {comment.isOwner && (
              <Badge variant="outline" className="text-xs">
                Author
              </Badge>
            )}
            <span className="text-sm text-gray-500">
              {formatTimeAgo(comment.createdAt)}
            </span>
            {comment.editedAt && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>

          <p className="mb-3 whitespace-pre-wrap text-gray-700">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="mb-3 flex items-center gap-4">
            {isAuthenticated && (
              <Button
                onClick={() => onLike(comment.id)}
                variant="ghost"
                size="sm"
                className={`h-7 text-xs ${
                  comment.isLiked ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                }`}
              >
                👍 {comment.likes > 0 && comment.likes}
              </Button>
            )}
            {isAuthenticated && (
              <Button
                onClick={() => onReply(comment.id)}
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-gray-600"
              >
                💬 Reply
              </Button>
            )}
            {comment.isOwner && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-gray-600"
              >
                ✏️ Edit
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <CommentForm
              onSubmit={onReplySubmit}
              onCancel={onReplyCancel}
              placeholder={`Reply to ${comment.userName}...`}
              isReply={true}
            />
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3 border-l border-gray-200 pl-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {reply.userAvatar ? (
                      <Image
                        src={reply.userAvatar}
                        alt={reply.userName}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-xs font-bold text-white">
                        {reply.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {reply.userName}
                      </span>
                      {reply.isOwner && (
                        <Badge variant="outline" className="text-xs">
                          Author
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(reply.createdAt)}
                      </span>
                    </div>

                    <p className="mb-2 text-sm text-gray-700">
                      {reply.content}
                    </p>

                    <div className="flex items-center gap-3">
                      {isAuthenticated && (
                        <Button
                          onClick={() => onLike(reply.id)}
                          variant="ghost"
                          size="sm"
                          className={`h-6 text-xs ${
                            reply.isLiked
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-600'
                          }`}
                        >
                          👍 {reply.likes > 0 && reply.likes}
                        </Button>
                      )}
                      {reply.isOwner && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-gray-600"
                        >
                          ✏️ Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  placeholder: string;
  isReply?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  placeholder,
  isReply = false,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      className={`mb-4 ${isReply ? 'border-gray-200 bg-gray-50' : 'border-green-200 bg-green-50'}`}
    >
      <CardContent className="pt-4">
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            maxLength={2000}
          />

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              {content.length}/2000 characters
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={onCancel} variant="outline" size="sm">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="default"
                size="sm"
                disabled={!content.trim() || isSubmitting}
              >
                {isSubmitting
                  ? 'Posting...'
                  : isReply
                    ? 'Post Reply'
                    : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeckComments;
