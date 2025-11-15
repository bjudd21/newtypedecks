/**
 * Meta-game Data Provider
 */

import type { MetaGameData } from '../types';

export async function getMetaGameData(): Promise<MetaGameData> {
  // This would typically fetch from a database of recent games/decks
  // For now, return mock data structure
  return {
    popularCards: [],
    popularArchetypes: [
      {
        name: 'Federation Control',
        description: 'Control-based deck focusing on Earth Federation units',
        usageRate: 15.2,
        winRate: 58.3,
        keyCards: [],
      },
      {
        name: 'Zeon Aggro',
        description: 'Fast aggressive deck using Zeon mobile suits',
        usageRate: 18.7,
        winRate: 52.1,
        keyCards: [],
      },
    ],
    trendingCards: [],
    metaBreakdown: {
      controlDecks: 35,
      aggroDecks: 28,
      midrangeDecks: 25,
      comboDecks: 12,
    },
  };
}
