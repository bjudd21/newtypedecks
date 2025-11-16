/**
 * Type definitions for DeckVersionHistory components
 */

export interface DeckVersion {
  id: string;
  version: number;
  name: string;
  description?: string;
  versionName?: string;
  changeNote?: string;
  createdBy: {
    id: string;
    name?: string;
    image?: string;
  };
  createdAt: string;
  cardCount: number;
  uniqueCards: number;
  totalCost: number;
  cards: Array<{
    id: string;
    cardId: string;
    quantity: number;
    category?: string;
    card: {
      id: string;
      name: string;
      cost?: number;
      type: { name: string };
      rarity: { name: string };
      imageUrl: string;
    };
  }>;
}

export interface DeckVersionHistoryProps {
  deckId: string;
  currentVersion?: number;
  onVersionRestore?: (versionId: string) => void;
  onVersionDelete?: (versionId: string) => void;
  className?: string;
}
