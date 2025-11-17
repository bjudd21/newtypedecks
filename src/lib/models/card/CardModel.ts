/**
 * Card Model Class
 * Provides reusable card data manipulation methods
 */

import type {
  CardWithRelations,
  CardSearchFilters,
  CardAbility,
  CardSortField,
} from '../../types/card';

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
    return (
      (this.card.clashPoints || 0) +
      (this.card.attackPoints || 0) +
      (this.card.hitPoints || 0)
    );
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
    if (!this.matchesTextFilter(filters)) return false;
    if (!this.matchesExactFilters(filters)) return false;
    if (!this.matchesBooleanFilters(filters)) return false;
    if (!this.matchesLevelRangeFilter(filters)) return false;
    if (!this.matchesCostRangeFilter(filters)) return false;
    if (!this.matchesClashPointsRangeFilter(filters)) return false;
    if (!this.matchesPriceRangeFilter(filters)) return false;
    if (!this.matchesHitPointsRangeFilter(filters)) return false;
    if (!this.matchesAttackPointsRangeFilter(filters)) return false;
    if (!this.matchesKeywordsFilter(filters)) return false;
    if (!this.matchesTagsFilter(filters)) return false;
    return true;
  }

  /**
   * Check if card matches text search filter
   */
  private matchesTextFilter(filters: CardSearchFilters): boolean {
    if (
      filters.name &&
      !this.card.name.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      return false;
    }
    return true;
  }

  /**
   * Check if card matches exact field filters
   */
  private matchesExactFilters(filters: CardSearchFilters): boolean {
    if (!this.matchesCoreIdFilters(filters)) return false;
    if (!this.matchesAttributeFilters(filters)) return false;
    if (!this.matchesIdentifierFilters(filters)) return false;
    return true;
  }

  /**
   * Check if card matches core ID filters (type, rarity, set)
   */
  private matchesCoreIdFilters(filters: CardSearchFilters): boolean {
    if (filters.typeId && this.card.typeId !== filters.typeId) return false;
    if (filters.rarityId && this.card.rarityId !== filters.rarityId)
      return false;
    if (filters.setId && this.card.setId !== filters.setId) return false;
    return true;
  }

  /**
   * Check if card matches attribute filters (faction, series, nation)
   */
  private matchesAttributeFilters(filters: CardSearchFilters): boolean {
    if (filters.faction && this.card.faction !== filters.faction) return false;
    if (filters.series && this.card.series !== filters.series) return false;
    if (filters.nation && this.card.nation !== filters.nation) return false;
    return true;
  }

  /**
   * Check if card matches identifier filters (pilot, model, language)
   */
  private matchesIdentifierFilters(filters: CardSearchFilters): boolean {
    if (filters.pilot && this.card.pilot !== filters.pilot) return false;
    if (filters.model && this.card.model !== filters.model) return false;
    if (filters.language && this.card.language !== filters.language)
      return false;
    return true;
  }

  /**
   * Check if card matches boolean flag filters
   */
  private matchesBooleanFilters(filters: CardSearchFilters): boolean {
    if (filters.isFoil !== undefined && this.card.isFoil !== filters.isFoil)
      return false;
    if (filters.isPromo !== undefined && this.card.isPromo !== filters.isPromo)
      return false;
    if (
      filters.isAlternate !== undefined &&
      this.card.isAlternate !== filters.isAlternate
    )
      return false;
    return true;
  }

  /**
   * Check if card matches level range filter
   */
  private matchesLevelRangeFilter(filters: CardSearchFilters): boolean {
    if (
      filters.levelMin !== undefined &&
      (this.card.level || 0) < filters.levelMin
    )
      return false;
    if (
      filters.levelMax !== undefined &&
      (this.card.level || 0) > filters.levelMax
    )
      return false;
    return true;
  }

  /**
   * Check if card matches cost range filter
   */
  private matchesCostRangeFilter(filters: CardSearchFilters): boolean {
    if (
      filters.costMin !== undefined &&
      (this.card.cost || 0) < filters.costMin
    )
      return false;
    if (
      filters.costMax !== undefined &&
      (this.card.cost || 0) > filters.costMax
    )
      return false;
    return true;
  }

  /**
   * Check if card matches clash points range filter
   */
  private matchesClashPointsRangeFilter(filters: CardSearchFilters): boolean {
    if (
      filters.clashPointsMin !== undefined &&
      (this.card.clashPoints || 0) < filters.clashPointsMin
    )
      return false;
    if (
      filters.clashPointsMax !== undefined &&
      (this.card.clashPoints || 0) > filters.clashPointsMax
    )
      return false;
    return true;
  }

  /**
   * Check if card matches price range filter
   */
  private matchesPriceRangeFilter(filters: CardSearchFilters): boolean {
    if (
      filters.priceMin !== undefined &&
      (this.card.price || 0) < filters.priceMin
    )
      return false;
    if (
      filters.priceMax !== undefined &&
      (this.card.price || 0) > filters.priceMax
    )
      return false;
    return true;
  }

  /**
   * Check if card matches hit points range filter
   */
  private matchesHitPointsRangeFilter(filters: CardSearchFilters): boolean {
    if (
      filters.hitPointsMin !== undefined &&
      (this.card.hitPoints || 0) < filters.hitPointsMin
    )
      return false;
    if (
      filters.hitPointsMax !== undefined &&
      (this.card.hitPoints || 0) > filters.hitPointsMax
    )
      return false;
    return true;
  }

  /**
   * Check if card matches attack points range filter
   */
  private matchesAttackPointsRangeFilter(filters: CardSearchFilters): boolean {
    if (
      filters.attackPointsMin !== undefined &&
      (this.card.attackPoints || 0) < filters.attackPointsMin
    )
      return false;
    if (
      filters.attackPointsMax !== undefined &&
      (this.card.attackPoints || 0) > filters.attackPointsMax
    )
      return false;
    return true;
  }

  /**
   * Check if card matches keywords filter
   */
  private matchesKeywordsFilter(filters: CardSearchFilters): boolean {
    if (filters.keywords && filters.keywords.length > 0) {
      const cardKeywords = this.card.keywords || [];
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
  private matchesTagsFilter(filters: CardSearchFilters): boolean {
    if (filters.tags && filters.tags.length > 0) {
      const cardTags = this.card.tags || [];
      const hasAllTags = filters.tags.every((tag) =>
        cardTags.some((cardTag) =>
          cardTag.toLowerCase().includes(tag.toLowerCase())
        )
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
      case 'name':
        return this.card.name;
      case 'level':
        return this.card.level || 0;
      case 'cost':
        return this.card.cost || 0;
      case 'clashPoints':
        return this.card.clashPoints || 0;
      case 'price':
        return this.card.price || 0;
      case 'hitPoints':
        return this.card.hitPoints || 0;
      case 'attackPoints':
        return this.card.attackPoints || 0;
      case 'setNumber':
        return this.card.setNumber;
      case 'createdAt':
        return this.card.createdAt;
      default:
        return this.card.name;
    }
  }

  /**
   * Convert to plain object for serialization
   */
  toObject(): CardWithRelations {
    return this.card;
  }
}
