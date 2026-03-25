/**
 * CommentCard Component
 * Displays a single comment with replies and actions
 */

import React from 'react';
import Image from 'next/image';
import { Button, Badge } from '@/components/ui';
import { useAuth } from '@/hooks';
import type { DeckComment } from '@/lib/services/socialService';
import { CommentForm } from './CommentForm';
import { formatTimeAgo } from './formatTimeAgo';

interface CommentCardProps {
  comment: DeckComment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string) => void;
  replyingTo: string | null;
  onReplySubmit: (content: string) => void;
  onReplyCancel: () => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onLike,
  onReply,
  replyingTo,
  onReplySubmit,
  onReplyCancel,
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="border-border border-l-2 pl-4">
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
            <div className="text-foreground flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-bold">
              {comment.userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-foreground font-medium">
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
            <span className="text-muted-foreground/70 text-sm">
              {formatTimeAgo(comment.createdAt)}
            </span>
            {comment.editedAt && (
              <span className="text-muted-foreground text-xs">(edited)</span>
            )}
          </div>

          <p className="text-muted-foreground mb-3 whitespace-pre-wrap">
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
                  comment.isLiked
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-muted-foreground'
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
                className="text-muted-foreground h-7 text-xs"
              >
                💬 Reply
              </Button>
            )}
            {comment.isOwner && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-7 text-xs"
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
            <div className="border-border mt-4 space-y-3 border-l pl-4">
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
                      <div className="text-foreground flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-xs font-bold">
                        {reply.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-foreground text-sm font-medium">
                        {reply.userName}
                      </span>
                      {reply.isOwner && (
                        <Badge variant="outline" className="text-xs">
                          Author
                        </Badge>
                      )}
                      <span className="text-muted-foreground/70 text-xs">
                        {formatTimeAgo(reply.createdAt)}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-2 text-sm">
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
                              : 'text-muted-foreground'
                          }`}
                        >
                          👍 {reply.likes > 0 && reply.likes}
                        </Button>
                      )}
                      {reply.isOwner && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground h-6 text-xs"
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
