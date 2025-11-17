/**
 * CardModel sorting utilities
 */

import type { CardWithRelations, CardSortField } from '../../../types/card';

/**
 * Get card's sortable value for a given field
 */
export function getSortableValue(
  card: CardWithRelations,
  field: CardSortField
): string | number | Date {
  switch (field) {
    case 'name':
      return card.name;
    case 'level':
      return card.level || 0;
    case 'cost':
      return card.cost || 0;
    case 'clashPoints':
      return card.clashPoints || 0;
    case 'price':
      return card.price || 0;
    case 'hitPoints':
      return card.hitPoints || 0;
    case 'attackPoints':
      return card.attackPoints || 0;
    case 'setNumber':
      return card.setNumber;
    case 'createdAt':
      return card.createdAt;
    default:
      return card.name;
  }
}
