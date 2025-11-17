/**
 * CardModel type checking methods
 */

import type { CardWithRelations } from '../../../types/card';

/**
 * Check if card is a Unit type
 */
export function isUnit(card: CardWithRelations): boolean {
  return card.type.category?.toLowerCase() === 'unit';
}

/**
 * Check if card is a Character type
 */
export function isCharacter(card: CardWithRelations): boolean {
  return card.type.category?.toLowerCase() === 'character';
}

/**
 * Check if card is a Command type
 */
export function isCommand(card: CardWithRelations): boolean {
  return card.type.category?.toLowerCase() === 'command';
}
