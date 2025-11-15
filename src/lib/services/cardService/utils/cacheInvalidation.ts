/**
 * Cache Invalidation Utilities
 */

import { searchCache } from '@/lib/services/searchCacheService';

interface CardCacheInvalidationData {
  typeId: string;
  rarityId: string;
  setId: string;
  faction?: string | null;
  series?: string | null;
  nation?: string | null;
}

/**
 * Invalidate cache entries for a card
 */
export async function invalidateCardCache(
  cardData: CardCacheInvalidationData
): Promise<void> {
  await searchCache.invalidateByFilters({
    typeId: cardData.typeId,
    rarityId: cardData.rarityId,
    setId: cardData.setId,
    faction: cardData.faction || undefined,
    series: cardData.series || undefined,
    nation: cardData.nation || undefined,
  });
}
