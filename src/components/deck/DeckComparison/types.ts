/**
 * Types for the DeckComparison feature
 */

export interface ComparableDeckCard {
  cardId: string;
  quantity: number;
  category: string;
  card: {
    id: string;
    name: string;
    cost?: number | null;
    type: { name: string } | null;
    rarity: { name: string } | null;
    imageUrl?: string | null;
    imageUrlSmall?: string | null;
  };
}

export interface ComparableDeck {
  id: string;
  name: string;
  description?: string | null;
  visibility: string;
  userId: string;
  user: { id: string; name: string | null } | null;
  cards: ComparableDeckCard[];
  createdAt: string;
}
