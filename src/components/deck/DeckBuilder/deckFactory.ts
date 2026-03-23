/**
 * Deck Factory Utility
 * Helper functions for creating new deck instances
 */

export const createNewDeck = (isAuthenticated: boolean, userId?: string) => ({
  id: `temp-${Date.now()}`,
  name: 'New Deck',
  description: '',
  isPublic: false,
  userId: isAuthenticated ? userId || 'authenticated' : 'anonymous',
  gameId: null,
  visibility: 'DRAFT' as const,
  deckCode: null,
  viewCount: 0,
  likeCount: 0,
  currentVersion: 1,
  versionName: null,
  isTemplate: false,
  templateSource: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  cards: [],
});
