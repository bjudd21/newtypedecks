/**
 * CardModel exports
 * Main CardModel class using modularized utilities
 */

import type {
  CardWithRelations,
  CardSearchFilters,
  CardAbility,
  CardSortField,
} from '../../../types/card';

// Import all modules
import * as core from './core';
import * as typeChecks from './typeChecks';
import { matchesTextFilter, matchesBooleanFilters } from './filtering/textFilters';
import { matchesExactFilters } from './filtering/idFilters';
import {
  matchesLevelRangeFilter,
  matchesCostRangeFilter,
  matchesClashPointsRangeFilter,
  matchesPriceRangeFilter,
  matchesHitPointsRangeFilter,
  matchesAttackPointsRangeFilter,
} from './filtering/rangeFilters';
import { matchesKeywordsFilter, matchesTagsFilter } from './filtering/arrayFilters';
import { getSortableValue as getSortableValueFn } from './sorting';
import { toObject as toObjectFn } from './serialization';

export class CardModel {
  constructor(private card: CardWithRelations) {}

  /**
   * Get formatted card display name with set number
   */
  getDisplayName(): string {
    return core.getDisplayName(this.card);
  }

  /**
   * Get card power level for sorting and comparison
   */
  getPowerLevel(): number {
    return core.getPowerLevel(this.card);
  }

  /**
   * Check if card is a Unit type
   */
  isUnit(): boolean {
    return typeChecks.isUnit(this.card);
  }

  /**
   * Check if card is a Character type
   */
  isCharacter(): boolean {
    return typeChecks.isCharacter(this.card);
  }

  /**
   * Check if card is a Command type
   */
  isCommand(): boolean {
    return typeChecks.isCommand(this.card);
  }

  /**
   * Get parsed abilities from JSON string
   */
  getParsedAbilities(): CardAbility[] {
    return core.getParsedAbilities(this.card);
  }

  /**
   * Get card rarity color for UI display
   */
  getRarityColor(): string {
    return core.getRarityColor(this.card);
  }

  /**
   * Check if card matches search filters
   */
  matchesFilters(filters: CardSearchFilters): boolean {
    if (!matchesTextFilter(this.card, filters)) return false;
    if (!matchesExactFilters(this.card, filters)) return false;
    if (!matchesBooleanFilters(this.card, filters)) return false;
    if (!matchesLevelRangeFilter(this.card, filters)) return false;
    if (!matchesCostRangeFilter(this.card, filters)) return false;
    if (!matchesClashPointsRangeFilter(this.card, filters)) return false;
    if (!matchesPriceRangeFilter(this.card, filters)) return false;
    if (!matchesHitPointsRangeFilter(this.card, filters)) return false;
    if (!matchesAttackPointsRangeFilter(this.card, filters)) return false;
    if (!matchesKeywordsFilter(this.card, filters)) return false;
    if (!matchesTagsFilter(this.card, filters)) return false;
    return true;
  }

  /**
   * Get card's sortable value for a given field
   */
  getSortableValue(field: CardSortField): string | number | Date {
    return getSortableValueFn(this.card, field);
  }

  /**
   * Convert to plain object for serialization
   */
  toObject(): CardWithRelations {
    return toObjectFn(this.card);
  }
}
