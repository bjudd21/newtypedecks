/**
 * Card data models and utilities
 *
 * This file provides reusable card data models, validation functions, and utility methods
 * that can be used across different parts of the application.
 */

import {
  type CardWithRelations,
  type CreateCardData,
  type UpdateCardData,
  type CardSearchFilters,
  type CardValidationResult,
  type CardAbility,
  type CardImageInfo,
  type CardSortField,
  type CardSortOrder,
  type CardLanguage,
  CARD_CONSTANTS,
  CARD_VALIDATION_SCHEMAS
} from '../types/card';

/**
 * Card Model Class - Provides reusable card data manipulation methods
 */
export class CardModel {
  constructor(private card: CardWithRelations) {}

  /**
   * Get formatted card display name with set number
   */
  getDisplayName(): string {
    return `${this.card.name} (${this.card.set.code}-${this.card.setNumber})`;
  }

  /**
   * Get card power level for sorting and comparison
   */
  getPowerLevel(): number {
    return (this.card.clashPoints || 0) + (this.card.attackPoints || 0) + (this.card.hitPoints || 0);
  }

  /**
   * Check if card is a Unit type
   */
  isUnit(): boolean {
    return this.card.type.category?.toLowerCase() === 'unit';
  }

  /**
   * Check if card is a Character type
   */
  isCharacter(): boolean {
    return this.card.type.category?.toLowerCase() === 'character';
  }

  /**
   * Check if card is a Command type
   */
  isCommand(): boolean {
    return this.card.type.category?.toLowerCase() === 'command';
  }

  /**
   * Get parsed abilities from JSON string
   */
  getParsedAbilities(): CardAbility[] {
    if (!this.card.abilities) return [];

    try {
      return JSON.parse(this.card.abilities) as CardAbility[];
    } catch {
      return [];
    }
  }

  /**
   * Get card rarity color for UI display
   */
  getRarityColor(): string {
    return this.card.rarity.color;
  }

  /**
   * Check if card matches search filters
   */
  matchesFilters(filters: CardSearchFilters): boolean {
    // Name search (case insensitive, partial match)
    if (filters.name && !this.card.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }

    // Exact field matches
    if (filters.typeId && this.card.typeId !== filters.typeId) return false;
    if (filters.rarityId && this.card.rarityId !== filters.rarityId) return false;
    if (filters.setId && this.card.setId !== filters.setId) return false;
    if (filters.faction && this.card.faction !== filters.faction) return false;
    if (filters.series && this.card.series !== filters.series) return false;
    if (filters.nation && this.card.nation !== filters.nation) return false;
    if (filters.pilot && this.card.pilot !== filters.pilot) return false;
    if (filters.model && this.card.model !== filters.model) return false;
    if (filters.language && this.card.language !== filters.language) return false;

    // Boolean flags
    if (filters.isFoil !== undefined && this.card.isFoil !== filters.isFoil) return false;
    if (filters.isPromo !== undefined && this.card.isPromo !== filters.isPromo) return false;
    if (filters.isAlternate !== undefined && this.card.isAlternate !== filters.isAlternate) return false;

    // Numeric range filters
    if (filters.levelMin !== undefined && (this.card.level || 0) < filters.levelMin) return false;
    if (filters.levelMax !== undefined && (this.card.level || 0) > filters.levelMax) return false;
    if (filters.costMin !== undefined && (this.card.cost || 0) < filters.costMin) return false;
    if (filters.costMax !== undefined && (this.card.cost || 0) > filters.costMax) return false;
    if (filters.clashPointsMin !== undefined && (this.card.clashPoints || 0) < filters.clashPointsMin) return false;
    if (filters.clashPointsMax !== undefined && (this.card.clashPoints || 0) > filters.clashPointsMax) return false;
    if (filters.priceMin !== undefined && (this.card.price || 0) < filters.priceMin) return false;
    if (filters.priceMax !== undefined && (this.card.price || 0) > filters.priceMax) return false;
    if (filters.hitPointsMin !== undefined && (this.card.hitPoints || 0) < filters.hitPointsMin) return false;
    if (filters.hitPointsMax !== undefined && (this.card.hitPoints || 0) > filters.hitPointsMax) return false;
    if (filters.attackPointsMin !== undefined && (this.card.attackPoints || 0) < filters.attackPointsMin) return false;
    if (filters.attackPointsMax !== undefined && (this.card.attackPoints || 0) > filters.attackPointsMax) return false;

    // Keywords array filtering
    if (filters.keywords && filters.keywords.length > 0) {
      const cardKeywords = this.card.keywords || [];
      const hasAllKeywords = filters.keywords.every(keyword =>
        cardKeywords.some(cardKeyword => cardKeyword.toLowerCase().includes(keyword.toLowerCase()))
      );
      if (!hasAllKeywords) return false;
    }

    // Tags array filtering
    if (filters.tags && filters.tags.length > 0) {
      const cardTags = this.card.tags || [];
      const hasAllTags = filters.tags.every(tag =>
        cardTags.some(cardTag => cardTag.toLowerCase().includes(tag.toLowerCase()))
      );
      if (!hasAllTags) return false;
    }

    return true;
  }

  /**
   * Get card's sortable value for a given field
   */
  getSortableValue(field: CardSortField): string | number | Date {
    switch (field) {
      case 'name': return this.card.name;
      case 'level': return this.card.level || 0;
      case 'cost': return this.card.cost || 0;
      case 'clashPoints': return this.card.clashPoints || 0;
      case 'price': return this.card.price || 0;
      case 'hitPoints': return this.card.hitPoints || 0;
      case 'attackPoints': return this.card.attackPoints || 0;
      case 'setNumber': return this.card.setNumber;
      case 'createdAt': return this.card.createdAt;
      default: return this.card.name;
    }
  }

  /**
   * Convert to plain object for serialization
   */
  toObject(): CardWithRelations {
    return this.card;
  }
}

/**
 * Card validation utilities
 */
export class CardValidator {
  /**
   * Validate card creation data
   */
  static validateCreateData(data: CreateCardData): CardValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!data.name?.trim()) {
      errors.push('Card name is required');
    } else if (data.name.length > CARD_VALIDATION_SCHEMAS.name.maxLength) {
      errors.push(`Card name must be ${CARD_VALIDATION_SCHEMAS.name.maxLength} characters or less`);
    } else if (!CARD_VALIDATION_SCHEMAS.name.pattern.test(data.name)) {
      errors.push('Card name contains invalid characters');
    }

    if (!data.typeId) errors.push('Card type is required');
    if (!data.rarityId) errors.push('Card rarity is required');
    if (!data.setId) errors.push('Card set is required');
    if (!data.setNumber?.trim()) errors.push('Set number is required');
    if (!data.imageUrl?.trim()) errors.push('Image URL is required');

    // Set number format validation
    if (data.setNumber && !CARD_VALIDATION_SCHEMAS.setNumber.pattern.test(data.setNumber)) {
      errors.push('Set number must be in format "ABC-123"');
    }

    // Numeric field validation
    if (data.level !== undefined && (data.level < 0 || data.level > CARD_CONSTANTS.MAX_LEVEL)) {
      errors.push(`Level must be between 0 and ${CARD_CONSTANTS.MAX_LEVEL}`);
    }

    if (data.cost !== undefined && (data.cost < 0 || data.cost > CARD_CONSTANTS.MAX_COST)) {
      errors.push(`Cost must be between 0 and ${CARD_CONSTANTS.MAX_COST}`);
    }

    if (data.clashPoints !== undefined && (data.clashPoints < 0 || data.clashPoints > CARD_CONSTANTS.MAX_CLASH_POINTS)) {
      errors.push(`Clash Points must be between 0 and ${CARD_CONSTANTS.MAX_CLASH_POINTS}`);
    }

    if (data.price !== undefined && (data.price < 0 || data.price > CARD_CONSTANTS.MAX_PRICE)) {
      errors.push(`Price must be between 0 and ${CARD_CONSTANTS.MAX_PRICE}`);
    }

    if (data.hitPoints !== undefined && (data.hitPoints < 0 || data.hitPoints > CARD_CONSTANTS.MAX_HIT_POINTS)) {
      errors.push(`Hit Points must be between 0 and ${CARD_CONSTANTS.MAX_HIT_POINTS}`);
    }

    if (data.attackPoints !== undefined && (data.attackPoints < 0 || data.attackPoints > CARD_CONSTANTS.MAX_ATTACK_POINTS)) {
      errors.push(`Attack Points must be between 0 and ${CARD_CONSTANTS.MAX_ATTACK_POINTS}`);
    }

    // Text field length validation
    if (data.description && data.description.length > CARD_VALIDATION_SCHEMAS.description.maxLength) {
      errors.push(`Description must be ${CARD_VALIDATION_SCHEMAS.description.maxLength} characters or less`);
    }

    if (data.officialText && data.officialText.length > CARD_VALIDATION_SCHEMAS.officialText.maxLength) {
      errors.push(`Official text must be ${CARD_VALIDATION_SCHEMAS.officialText.maxLength} characters or less`);
    }

    if (data.abilities && data.abilities.length > CARD_VALIDATION_SCHEMAS.abilities.maxLength) {
      errors.push(`Abilities must be ${CARD_VALIDATION_SCHEMAS.abilities.maxLength} characters or less`);
    }

    // Array field validation
    if (data.keywords && data.keywords.length > CARD_VALIDATION_SCHEMAS.keywords.maxItems) {
      errors.push(`Maximum ${CARD_VALIDATION_SCHEMAS.keywords.maxItems} keywords allowed`);
    }

    if (data.keywords) {
      for (const keyword of data.keywords) {
        if (keyword.length > CARD_VALIDATION_SCHEMAS.keywords.maxLength) {
          errors.push(`Each keyword must be ${CARD_VALIDATION_SCHEMAS.keywords.maxLength} characters or less`);
          break;
        }
      }
    }

    if (data.tags && data.tags.length > CARD_VALIDATION_SCHEMAS.tags.maxItems) {
      errors.push(`Maximum ${CARD_VALIDATION_SCHEMAS.tags.maxItems} tags allowed`);
    }

    if (data.tags) {
      for (const tag of data.tags) {
        if (tag.length > CARD_VALIDATION_SCHEMAS.tags.maxLength) {
          errors.push(`Each tag must be ${CARD_VALIDATION_SCHEMAS.tags.maxLength} characters or less`);
          break;
        }
      }
    }

    // Faction validation
    if (data.faction && !CARD_CONSTANTS.SUPPORTED_FACTIONS.includes(data.faction as any)) {
      warnings.push(`Faction "${data.faction}" is not in the standard faction list`);
    }

    // Series validation
    if (data.series && !CARD_CONSTANTS.SUPPORTED_SERIES.includes(data.series as any)) {
      warnings.push(`Series "${data.series}" is not in the standard series list`);
    }

    // Language validation
    if (data.language && !CARD_CONSTANTS.SUPPORTED_LANGUAGES.includes(data.language as CardLanguage)) {
      errors.push(`Language "${data.language}" is not supported`);
    }

    // JSON validation for abilities
    if (data.abilities) {
      try {
        const abilities = JSON.parse(data.abilities);
        if (!Array.isArray(abilities)) {
          errors.push('Abilities must be a valid JSON array');
        } else {
          for (const ability of abilities) {
            if (!ability.name || !ability.description || !ability.type) {
              errors.push('Each ability must have name, description, and type fields');
              break;
            }
          }
        }
      } catch {
        errors.push('Abilities must be valid JSON');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate card update data
   */
  static validateUpdateData(data: UpdateCardData): CardValidationResult {
    const errors: string[] = [];
    const _warnings: string[] = []; // Reserved for future validation warnings

    if (!data.id) {
      errors.push('Card ID is required for updates');
    }

    // Only validate fields that are being updated
    const createData = { ...data } as CreateCardData;

    // Skip validation for undefined fields
    Object.keys(createData).forEach(key => {
      if (createData[key as keyof CreateCardData] === undefined) {
        delete createData[key as keyof CreateCardData];
      }
    });

    // If no fields to update, it's still valid
    if (Object.keys(createData).length === 0) {
      return { isValid: true, errors: [], warnings: [] };
    }

    const createValidation = CardValidator.validateCreateData(createData);

    return {
      isValid: createValidation.isValid,
      errors: createValidation.errors,
      warnings: createValidation.warnings
    };
  }
}

/**
 * Card utility functions
 */
export class CardUtils {
  /**
   * Sort cards by specified field and order
   */
  static sortCards(cards: CardWithRelations[], field: CardSortField, order: CardSortOrder = 'asc'): CardWithRelations[] {
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
  static filterCards(cards: CardWithRelations[], filters: CardSearchFilters): CardWithRelations[] {
    return cards.filter(card => new CardModel(card).matchesFilters(filters));
  }

  /**
   * Group cards by a specified field
   */
  static groupCardsByField(cards: CardWithRelations[], field: keyof CardWithRelations): Record<string, CardWithRelations[]> {
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

    let levelSum = 0, levelCount = 0;
    let costSum = 0, costCount = 0;
    let clashPointsSum = 0, clashPointsCount = 0;
    let priceSum = 0, priceCount = 0;
    let hitPointsSum = 0, hitPointsCount = 0;
    let attackPointsSum = 0, attackPointsCount = 0;

    for (const card of cards) {
      // Count by type
      const typeName = card.type.name;
      stats.byType[typeName] = (stats.byType[typeName] || 0) + 1;

      // Count by rarity
      const rarityName = card.rarity.name;
      stats.byRarity[rarityName] = (stats.byRarity[rarityName] || 0) + 1;

      // Count by faction
      if (card.faction) {
        stats.byFaction[card.faction] = (stats.byFaction[card.faction] || 0) + 1;
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
    stats.averageLevel = levelCount > 0 ? Math.round((levelSum / levelCount) * 100) / 100 : 0;
    stats.averageCost = costCount > 0 ? Math.round((costSum / costCount) * 100) / 100 : 0;
    stats.averageClashPoints = clashPointsCount > 0 ? Math.round((clashPointsSum / clashPointsCount) * 100) / 100 : 0;
    stats.averagePrice = priceCount > 0 ? Math.round((priceSum / priceCount) * 100) / 100 : 0;
    stats.averageHitPoints = hitPointsCount > 0 ? Math.round((hitPointsSum / hitPointsCount) * 100) / 100 : 0;
    stats.averageAttackPoints = attackPointsCount > 0 ? Math.round((attackPointsSum / attackPointsCount) * 100) / 100 : 0;

    return stats;
  }

  /**
   * Create card image info from URLs
   */
  static createImageInfo(originalUrl: string, smallUrl?: string, largeUrl?: string): CardImageInfo {
    return {
      originalUrl,
      smallUrl,
      largeUrl,
      thumbnailUrl: smallUrl, // Use small as thumbnail
      altText: 'Gundam Card Game card image',
      format: originalUrl.split('.').pop()?.toLowerCase() || 'unknown'
    };
  }

  /**
   * Extract keywords from card text
   */
  static extractKeywordsFromText(text: string): string[] {
    if (!text) return [];

    // Common Gundam Card Game keywords
    const commonKeywords = [
      'Pilot', 'Mobile Suit', 'Battleship', 'Support', 'Command', 'Newtype',
      'Cyber', 'Generation', 'Strike', 'Quick', 'Rush', 'Shield', 'Armor',
      'Beam', 'Physical', 'Range', 'Close', 'Long', 'All Range'
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
    const powerLevel = (card.clashPoints || 0) + (card.attackPoints || 0) + (card.hitPoints || 0);
    if (powerLevel >= 1000) tags.push('High Power');
    else if (powerLevel >= 500) tags.push('Medium Power');
    else tags.push('Low Power');

    return Array.from(new Set(tags)); // Remove duplicates
  }
}

/**
 * Export all models and utilities for easy importing
 */
export { CARD_CONSTANTS, CARD_VALIDATION_SCHEMAS } from '../types/card';
export type * from '../types/card';