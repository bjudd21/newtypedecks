/**
 * Card Sorting Utilities
 */

import type { DeckCard, ExportOptions } from '../types';

/**
 * Sort cards based on options
 */
export function sortCards(cards: DeckCard[], options: ExportOptions): DeckCard[] {
  const sortBy = options.sortBy || 'name';
  const sortOrder = options.sortOrder || 'asc';

  return [...cards].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.card.name.localeCompare(b.card.name);
        break;
      case 'cost':
        comparison = (a.card.cost || 0) - (b.card.cost || 0);
        break;
      case 'type':
        comparison = (a.card.type?.name || '').localeCompare(
          b.card.type?.name || ''
        );
        break;
      case 'quantity':
        comparison = a.quantity - b.quantity;
        break;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
}
