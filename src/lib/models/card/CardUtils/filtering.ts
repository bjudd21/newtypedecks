/**
 * Card filtering utilities
 */

import type { CardWithRelations, CardSearchFilters } from '../../../types/card';
import { CardModel } from '../CardModel';

/**
 * Filter cards using provided filters
 */
export function filterCards(
  cards: CardWithRelations[],
  filters: CardSearchFilters
): CardWithRelations[] {
  return cards.filter((card) => new CardModel(card).matchesFilters(filters));
}
