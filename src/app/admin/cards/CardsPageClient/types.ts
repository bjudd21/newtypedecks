/**
 * Type definitions for admin CardsPageClient
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
  description?: string | null;
  officialText?: string | null;
  clashPoints?: number | null;
  price?: number | null;
  hitPoints?: number | null;
  attackPoints?: number | null;
  faction?: string | null;
  pilot?: string | null;
  model?: string | null;
  series?: string | null;
  createdAt?: Date | string;
  nation?: string | null;
  keywords?: string[] | null;
  tags?: string[] | null;
  isFoil?: boolean | null;
  isPromo?: boolean | null;
  isAlternate?: boolean | null;
  language?: string | null;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
}
