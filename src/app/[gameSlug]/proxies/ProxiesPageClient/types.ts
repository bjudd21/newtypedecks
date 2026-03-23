/**
 * Types for the proxy generator page
 */

import type { CardWithRelations } from '@/lib/types/card';

export interface ProxyEntry {
  card: CardWithRelations;
  quantity: number;
}

export const MAX_PROXY_QUANTITY = 4;
export const CARDS_PER_PAGE = 9; // 3x3 grid
