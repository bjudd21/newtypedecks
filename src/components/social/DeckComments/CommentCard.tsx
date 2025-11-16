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
