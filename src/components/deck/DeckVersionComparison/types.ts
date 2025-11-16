/**
 * Type definitions for DeckVersionComparison components
 */

export interface DeckCard {
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
}

export interface DeckVersion {
  id: string;
  version: number;
  name: string;
  versionName?: string;
  createdAt: string;
  cardCount: number;
  uniqueCards: number;
  totalCost: number;
  cards: DeckCard[];
}

export interface CardChange {
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  cardName: string;
  cardId: string;
  card: DeckCard['card'];
  oldQuantity?: number;
  newQuantity?: number;
  category?: string;
}

export interface DeckVersionComparisonProps {
  versionA: DeckVersion;
  versionB: DeckVersion;
  className?: string;
}
