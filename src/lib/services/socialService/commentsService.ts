/**
 * Comments Service
 * Handles deck comments operations
 */

import type { DeckComment } from './types';

/**
 * Get deck comments
 */
export async function getDeckComments(
  deckId: string,
  _page = 1,
  _limit = 20
): Promise<{
  comments: DeckComment[];
  totalCount: number;
}> {
  // Mock implementation
  const mockComments: DeckComment[] = [
    {
      id: '1',
      deckId,
      userId: 'user1',
      userName: 'StrategyExpert',
      content:
        'Love the inclusion of Mobile Suit Gundam in the main deck. Have you considered adding more Command cards for better control?',
      createdAt: new Date('2024-03-16T10:30:00'),
      updatedAt: new Date('2024-03-16T10:30:00'),
      likes: 5,
      replies: [
        {
          id: '1-1',
          deckId,
          userId: 'author',
          userName: 'DeckAuthor',
          content:
            'Thanks for the suggestion! I tried that in earlier versions but found it made the deck too slow.',
          createdAt: new Date('2024-03-16T14:15:00'),
          updatedAt: new Date('2024-03-16T14:15:00'),
          parentId: '1',
          likes: 2,
        },
      ],
    },
    {
      id: '2',
      deckId,
      userId: 'user2',
      userName: 'NewPlayer',
      content: 'Great beginner-friendly deck! Easy to pilot and understand.',
      createdAt: new Date('2024-03-15T16:45:00'),
      updatedAt: new Date('2024-03-15T16:45:00'),
      likes: 3,
    },
  ];

  return {
    comments: mockComments,
    totalCount: 12,
  };
}

/**
 * Post comment on deck
 */
export async function postDeckComment(
  deckId: string,
  userId: string,
  content: string,
  parentId?: string
): Promise<DeckComment> {
  if (!content.trim()) {
    throw new Error('Comment cannot be empty');
  }

  // This would save to database
  return {
    id: `comment_${Date.now()}`,
    deckId,
    userId,
    userName: 'CurrentUser',
    content: content.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
    parentId,
    likes: 0,
    isOwner: true,
  };
}

/**
 * Like/unlike comment
 */
export async function toggleCommentLike(
  _commentId: string,
  _userId: string
): Promise<{ isLiked: boolean; likeCount: number }> {
  // This would update in database
  return {
    isLiked: true,
    likeCount: 8,
  };
}
