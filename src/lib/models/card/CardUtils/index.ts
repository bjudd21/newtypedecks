/**
 * CardUtils exports
 * Main CardUtils class using modularized utilities
 */

import type {
  CardWithRelations,
  CardSearchFilters,
  CardImageInfo,
  CardSortField,
  CardSortOrder,
} from '../../../types/card';

// Import all utilities
import { sortCards } from './sorting';
import { filterCards } from './filtering';
import { groupCardsByField } from './grouping';
import { calculateStats } from './statistics';
import { createImageInfo } from './images';
import { extractKeywordsFromText } from './keywords';
import { generateCardTags } from './tags';

export class CardUtils {
  /**
   * Sort cards by specified field and order
   */
  static sortCards(
    cards: CardWithRelations[],
    field: CardSortField,
    order: CardSortOrder = 'asc'
  ): CardWithRelations[] {
    return sortCards(cards, field, order);
  }

  /**
   * Filter cards using provided filters
   */
  static filterCards(
    cards: CardWithRelations[],
    filters: CardSearchFilters
  ): CardWithRelations[] {
    return filterCards(cards, filters);
  }

  /**
   * Group cards by a specified field
   */
  static groupCardsByField(
    cards: CardWithRelations[],
    field: keyof CardWithRelations
  ): Record<string, CardWithRelations[]> {
    return groupCardsByField(cards, field);
  }

  /**
   * Calculate card statistics
   */
  static calculateStats(cards: CardWithRelations[]) {
    return calculateStats(cards);
  }

  /**
   * Create card image info from URLs
   */
  static createImageInfo(
    originalUrl: string,
    smallUrl?: string,
    largeUrl?: string
  ): CardImageInfo {
    return createImageInfo(originalUrl, smallUrl, largeUrl);
  }

  /**
   * Extract keywords from card text
   */
  static extractKeywordsFromText(text: string): string[] {
    return extractKeywordsFromText(text);
  }

  /**
   * Generate card tags based on attributes
   */
  static generateCardTags(card: CardWithRelations): string[] {
    return generateCardTags(card);
  }
}
