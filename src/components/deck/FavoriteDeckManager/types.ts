/**
 * Type definitions for FavoriteDeckManager
 */

import type { DeckVisibility } from '@prisma/client';

export interface FavoriteDeck {
  id: string;
  favoritedAt: string;
  deck: {
    id: string;
    name: string;
    description?: string;
    visibility: DeckVisibility;
    isTemplate: boolean;
    templateSource?: string;
    creator: {
      id: string;
      name?: string;
      image?: string;
    };
    cardCount: number;
    uniqueCards: number;
    totalCost: number;
    colors: string[];
    favoriteCount: number;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface FavoriteDeckManagerProps {
  onDeckSelect?: (deckId: string) => void;
  onRemoveFavorite?: (deckId: string) => void;
  className?: string;
}
