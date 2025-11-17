/**
 * Card Service Helpers
 * Helper functions for common card operations
 */

import type {
  CardWithRelations,
  CardSearchFilters,
  CardSortField,
} from '@/lib/types/card';
import { CardModel, CardValidator, CardUtils } from '@/lib/models/card';

export const CardHelpers = {
  /**
   * Format card display name
   */
  formatDisplayName: (card: CardWithRelations) =>
    new CardModel(card).getDisplayName(),

  /**
   * Get card power level
   */
  getPowerLevel: (card: CardWithRelations) =>
    new CardModel(card).getPowerLevel(),

  /**
   * Check if card matches filters
   */
  matchesFilters: (card: CardWithRelations, filters: CardSearchFilters) =>
    new CardModel(card).matchesFilters(filters),

  /**
   * Get sortable value for card
   */
  getSortableValue: (card: CardWithRelations, field: string) =>
    new CardModel(card).getSortableValue(field as CardSortField),

  /**
   * Validate card data
   */
  validateCard: CardValidator.validateCreateData,

  /**
   * Generate card tags
   */
  generateTags: CardUtils.generateCardTags,

  /**
   * Extract keywords from text
   */
  extractKeywords: CardUtils.extractKeywordsFromText,

  /**
   * Create image info
   */
  createImageInfo: CardUtils.createImageInfo,
};
