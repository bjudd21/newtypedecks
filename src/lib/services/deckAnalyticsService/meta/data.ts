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
        name: 'Control',
        description:
          'Control-based deck focusing on defense and resource advantage',
        usageRate: 15.2,
        winRate: 58.3,
        keyCards: [],
      },
      {
        name: 'Aggro',
        description: 'Fast aggressive deck with low-cost offensive units',
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
