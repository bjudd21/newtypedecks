/**
 * CardModel serialization utilities
 */

import type { CardWithRelations } from '../../../types/card';

/**
 * Convert to plain object for serialization
 */
export function toObject(card: CardWithRelations): CardWithRelations {
  return card;
}
