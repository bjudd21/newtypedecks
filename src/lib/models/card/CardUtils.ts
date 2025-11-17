/**
 * Card Utility Functions
 * Provides static utility methods for card operations
 */

import type {
  CardWithRelations,
  CardSearchFilters,
  CardImageInfo,
  CardSortField,
  CardSortOrder,
} from '../../types/card';
import { CardModel } from './CardModel';

export class CardUtils {
  /**
   * Sort cards by specified field and order
   */
  static sortCards(
    cards: CardWithRelations[],
    field: CardSortField,
    order: CardSortOrder = 'asc'
  ): CardWithRelations[] {
    return [...cards].sort((a, b) => {
      const cardA = new CardModel(a);
      const cardB = new CardModel(b);

      const valueA = cardA.getSortableValue(field);
      const valueB = cardB.getSortableValue(field);

      let comparison = 0;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else if (valueA instanceof Date && valueB instanceof Date) {
        comparison = valueA.getTime() - valueB.getTime();
      } else {
        comparison = Number(valueA) - Number(valueB);
      }

      return order === 'desc' ? -comparison : comparison;
    });
  }

  /**
   * Filter cards using provided filters
   */
  static filterCards(
    cards: CardWithRelations[],
    filters: CardSearchFilters
  ): CardWithRelations[] {
    return cards.filter((card) => new CardModel(card).matchesFilters(filters));
  }

  /**
   * Group cards by a specified field
   */
  static groupCardsByField(
    cards: CardWithRelations[],
    field: keyof CardWithRelations
  ): Record<string, CardWithRelations[]> {
    const groups: Record<string, CardWithRelations[]> = {};

    for (const card of cards) {
      const value = String(card[field] || 'Unknown');
      if (!groups[value]) {
        groups[value] = [];
      }
      groups[value].push(card);
    }

    return groups;
  }

  /**
   * Calculate card statistics
   */
  static calculateStats(cards: CardWithRelations[]) {
    const stats = {
      total: cards.length,
      byType: {} as Record<string, number>,
      byRarity: {} as Record<string, number>,
      byFaction: {} as Record<string, number>,
      bySeries: {} as Record<string, number>,
      averageLevel: 0,
      averageCost: 0,
      averageClashPoints: 0,
      averagePrice: 0,
      averageHitPoints: 0,
      averageAttackPoints: 0,
    };

    let levelSum = 0,
      levelCount = 0;
    let costSum = 0,
      costCount = 0;
    let clashPointsSum = 0,
      clashPointsCount = 0;
    let priceSum = 0,
      priceCount = 0;
    let hitPointsSum = 0,
      hitPointsCount = 0;
    let attackPointsSum = 0,
      attackPointsCount = 0;

    for (const card of cards) {
      // Count by type
      const typeName = card.type.name;
      stats.byType[typeName] = (stats.byType[typeName] || 0) + 1;

      // Count by rarity
      const rarityName = card.rarity.name;
      stats.byRarity[rarityName] = (stats.byRarity[rarityName] || 0) + 1;

      // Count by faction
      if (card.faction) {
        stats.byFaction[card.faction] =
          (stats.byFaction[card.faction] || 0) + 1;
      }

      // Count by series
      if (card.series) {
        stats.bySeries[card.series] = (stats.bySeries[card.series] || 0) + 1;
      }

      // Sum numeric values for averages
      if (card.level !== null && card.level !== undefined) {
        levelSum += card.level;
        levelCount++;
      }
      if (card.cost !== null && card.cost !== undefined) {
        costSum += card.cost;
        costCount++;
      }
      if (card.clashPoints !== null && card.clashPoints !== undefined) {
        clashPointsSum += card.clashPoints;
        clashPointsCount++;
      }
      if (card.price !== null && card.price !== undefined) {
        priceSum += card.price;
        priceCount++;
      }
      if (card.hitPoints !== null && card.hitPoints !== undefined) {
        hitPointsSum += card.hitPoints;
        hitPointsCount++;
      }
      if (card.attackPoints !== null && card.attackPoints !== undefined) {
        attackPointsSum += card.attackPoints;
        attackPointsCount++;
      }
    }

    // Calculate averages
    stats.averageLevel =
      levelCount > 0 ? Math.round((levelSum / levelCount) * 100) / 100 : 0;
    stats.averageCost =
      costCount > 0 ? Math.round((costSum / costCount) * 100) / 100 : 0;
    stats.averageClashPoints =
      clashPointsCount > 0
        ? Math.round((clashPointsSum / clashPointsCount) * 100) / 100
        : 0;
    stats.averagePrice =
      priceCount > 0 ? Math.round((priceSum / priceCount) * 100) / 100 : 0;
    stats.averageHitPoints =
      hitPointsCount > 0
        ? Math.round((hitPointsSum / hitPointsCount) * 100) / 100
        : 0;
    stats.averageAttackPoints =
      attackPointsCount > 0
        ? Math.round((attackPointsSum / attackPointsCount) * 100) / 100
        : 0;

    return stats;
  }

  /**
   * Create card image info from URLs
   */
  static createImageInfo(
    originalUrl: string,
    smallUrl?: string,
    largeUrl?: string
  ): CardImageInfo {
    return {
      originalUrl,
      smallUrl,
      largeUrl,
      thumbnailUrl: smallUrl, // Use small as thumbnail
      altText: 'Gundam Card Game card image',
      format: originalUrl.split('.').pop()?.toLowerCase() || 'unknown',
    };
  }

  /**
   * Extract keywords from card text
   */
  static extractKeywordsFromText(text: string): string[] {
    if (!text) return [];

    // Common Gundam Card Game keywords
    const commonKeywords = [
      'Pilot',
      'Mobile Suit',
      'Battleship',
      'Support',
      'Command',
      'Newtype',
      'Cyber',
      'Generation',
      'Strike',
      'Quick',
      'Rush',
      'Shield',
      'Armor',
      'Beam',
      'Physical',
      'Range',
      'Close',
      'Long',
      'All Range',
    ];

    const foundKeywords: string[] = [];
    const lowerText = text.toLowerCase();

    for (const keyword of commonKeywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    }

    return Array.from(new Set(foundKeywords)); // Remove duplicates
  }

  /**
   * Generate card tags based on attributes
   */
  static generateCardTags(card: CardWithRelations): string[] {
    const tags: string[] = [];

    // Add type-based tags
    if (card.type?.name) tags.push(card.type.name);
    if (card.type?.category) tags.push(card.type.category);

    // Add rarity tag
    if (card.rarity?.name) tags.push(card.rarity.name);

    // Add faction tag
    if (card.faction) tags.push(card.faction);

    // Add series tag
    if (card.series) tags.push(card.series);

    // Add nation tag
    if (card.nation) tags.push(card.nation);

    // Add special tags based on attributes
    if (card.isFoil) tags.push('Foil');
    if (card.isPromo) tags.push('Promo');
    if (card.isAlternate) tags.push('Alternate Art');

    // Add power level tags
    const powerLevel =
      (card.clashPoints || 0) +
      (card.attackPoints || 0) +
      (card.hitPoints || 0);
    if (powerLevel >= 1000) tags.push('High Power');
    else if (powerLevel >= 500) tags.push('Medium Power');
    else tags.push('Low Power');

    return Array.from(new Set(tags)); // Remove duplicates
  }
}
