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
  currentVersion: 1,
  versionName: null,
  isTemplate: false,
  templateSource: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  cards: [],
});
