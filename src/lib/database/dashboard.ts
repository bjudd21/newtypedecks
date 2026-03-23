/**
 * Dashboard data utilities
 *
 * Fetches cross-game summary data for the user dashboard.
 * Queries run server-side only — never import this in client components.
 */

import { prisma } from './index';
import { getAllActiveGames } from './games';

export interface RecentDeck {
  id: string;
  name: string;
  updatedAt: string;
  visibility: string;
}

export interface GameDashboardData {
  game: {
    id: string;
    slug: string;
    name: string;
    shortName: string | null;
    primaryColor: string | null;
  };
  deckCount: number;
  recentDecks: RecentDeck[];
  collectionCardCount: number;
}

export interface DashboardData {
  gameData: GameDashboardData[];
  totalDecks: number;
  totalCardsOwned: number;
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const games = await getAllActiveGames();

  const gameData = await Promise.all(
    games.map(async (game): Promise<GameDashboardData> => {
      const [deckCount, recentDecks, collection] = await Promise.all([
        prisma.deck.count({ where: { userId, gameId: game.id } }),
        prisma.deck.findMany({
          where: { userId, gameId: game.id },
          orderBy: { updatedAt: 'desc' },
          take: 3,
          select: { id: true, name: true, updatedAt: true, visibility: true },
        }),
        prisma.collection.findFirst({
          where: { userId, gameId: game.id },
          select: { id: true },
        }),
      ]);

      let collectionCardCount = 0;
      if (collection) {
        const agg = await prisma.collectionCard.aggregate({
          where: { collectionId: collection.id },
          _sum: { quantity: true },
        });
        collectionCardCount = agg._sum.quantity ?? 0;
      }

      return {
        game: {
          id: game.id,
          slug: game.slug,
          name: game.name,
          shortName: game.shortName,
          primaryColor: game.primaryColor,
        },
        deckCount,
        recentDecks: recentDecks.map((d) => ({
          id: d.id,
          name: d.name,
          updatedAt: d.updatedAt.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          visibility: d.visibility,
        })),
        collectionCardCount,
      };
    })
  );

  return {
    gameData,
    totalDecks: gameData.reduce((sum, g) => sum + g.deckCount, 0),
    totalCardsOwned: gameData.reduce(
      (sum, g) => sum + g.collectionCardCount,
      0
    ),
  };
}
