/**
 * Card sorting utilities
 */

import type {
  CardWithRelations,
  CardSortField,
  CardSortOrder,
} from '../../../types/card';
import { CardModel } from '../CardModel';

/**
 * Sort cards by specified field and order
 */
export function sortCards(
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
