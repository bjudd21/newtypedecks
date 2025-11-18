/**
 * Array-based filter matching (keywords, tags)
 */

import type {
  CardWithRelations,
  CardSearchFilters,
} from '../../../../types/card';

/**
 * Check if card matches keywords filter
 */
export function matchesKeywordsFilter(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (filters.keywords && filters.keywords.length > 0) {
    const cardKeywords = card.keywords || [];
    const hasAllKeywords = filters.keywords.every((keyword) =>
      cardKeywords.some((cardKeyword) =>
        cardKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    if (!hasAllKeywords) return false;
  }
  return true;
}

/**
 * Check if card matches tags filter
 */
export function matchesTagsFilter(
  card: CardWithRelations,
  filters: CardSearchFilters
): boolean {
  if (filters.tags && filters.tags.length > 0) {
    const cardTags = card.tags || [];
    const hasAllTags = filters.tags.every((tag) =>
      cardTags.some((cardTag) =>
        cardTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
    if (!hasAllTags) return false;
  }
  return true;
}
