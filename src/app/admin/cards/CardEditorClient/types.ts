/**
 * Types for the admin card editor.
 */

import type { GameConfig } from '@/lib/types/game';

export interface AdminGame {
  id: string;
  slug: string;
  name: string;
  cardCount: number;
  config: GameConfig;
}

export interface ReferenceItem {
  id: string;
  name: string;
  color?: string;
  code?: string;
}

export interface ReferenceData {
  types: ReferenceItem[];
  rarities: ReferenceItem[];
  sets: ReferenceItem[];
}

/** Card shape returned by /api/cards for the admin list + editor. */
export interface AdminCard {
  id: string;
  name: string;
  typeId: string;
  rarityId: string;
  setId: string;
  setNumber: string;
  imageUrl?: string | null;
  imageUrlSmall?: string | null;
  imageUrlLarge?: string | null;
  description?: string | null;
  officialText?: string | null;
  level?: number | null;
  cost?: number | null;
  clashPoints?: number | null;
  price?: number | null;
  hitPoints?: number | null;
  attackPoints?: number | null;
  keywords?: string[] | null;
  tags?: string[] | null;
  isFoil?: boolean | null;
  isPromo?: boolean | null;
  isAlternate?: boolean | null;
  language?: string | null;
  gameAttributes?: Record<string, string | number | boolean | null> | null;
  type?: { name: string } | null;
  rarity?: { name: string; color: string } | null;
  set?: { name: string; code: string } | null;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
}

/** Editable form state. Core numeric fields and game-specific custom fields
 *  are both driven by the game's GameConfig.cardSchema. */
export interface CardFormState {
  name: string;
  typeId: string;
  rarityId: string;
  setId: string;
  setNumber: string;
  imageUrl: string;
  imageUrlSmall: string;
  imageUrlLarge: string;
  description: string;
  officialText: string;
  /** Values for cardSchema.fields (flat Card columns, e.g. level/cost/hitPoints). */
  coreValues: Record<string, number | null>;
  /** Values for cardSchema.customFields (gameAttributes JSONB). */
  customValues: Record<string, string | number | boolean | null>;
  keywordsInput: string;
  tagsInput: string;
  isFoil: boolean;
  isPromo: boolean;
  isAlternate: boolean;
  language: string;
}

export type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'saved'; at: number }
  | { status: 'error'; message: string };
