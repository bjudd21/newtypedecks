/**
 * CardTable types
 */

export interface Card {
  id: string;
  name: string;
  typeId: string;
  rarityId: string;
  setId: string;
  level?: number | null;
  cost?: number | null;
  imageUrl?: string | null;
  setNumber?: string | null;
  type?: { name: string } | null;
  rarity?: { name: string; color: string } | null;
  set?: { name: string; code: string } | null;
  createdAt?: Date | string;
}

export interface CardTableProps {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
  isLoading?: boolean;
}

export type SortOrder = 'asc' | 'desc';
