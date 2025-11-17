/**
 * DeckComments Sub-Components
 * Exports all deck comments components and utilities
 */

export { CommentCard } from './CommentCard';
export { CommentForm } from './CommentForm';
export { CommentsEmptyState } from './CommentsEmptyState';
export { CommentsLoadingState } from './CommentsLoadingState';
export { formatTimeAgo } from './formatTimeAgo';

// Export main component
export { DeckCommentsContent } from './DeckCommentsContent';
export type { DeckCommentsProps } from './types';

// Export hooks
export { useCommentsState } from './hooks/useCommentsState';
export { useCommentsHandlers } from './hooks/useCommentsHandlers';
export { useCommentsEffects } from './hooks/useCommentsEffects';
