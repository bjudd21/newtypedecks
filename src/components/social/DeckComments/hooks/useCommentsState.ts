'use client';
/**
 * Custom hook for comments state management
 */

import { useState } from 'react';
import type { DeckComment } from '@/lib/services/socialService';

export function useCommentsState() {
  const [comments, setComments] = useState<DeckComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalComments, setTotalComments] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  return {
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
  };
}
