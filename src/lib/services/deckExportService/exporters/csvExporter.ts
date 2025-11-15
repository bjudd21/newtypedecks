/**
 * CSV Export Format
 */

import type { ExportableDeck, ExportOptions } from '../types';
import { sortCards } from '../utils';

/**
 * Export to CSV format
 */
export function exportToCSV(deck: ExportableDeck, options: ExportOptions): string {
  const headers = [
    'Quantity',
    'Name',
    'Set',
    'Set Number',
    'Cost',
    'Type',
    'Rarity',
    'Faction',
    'Pilot',
    'Model',
    'Category',
  ];

  let csv = headers.join(',') + '\n';

  const sortedCards = sortCards(deck.cards, options);

  for (const deckCard of sortedCards) {
    const row = [
      deckCard.quantity,
      `"${deckCard.card.name.replace(/"/g, '""')}"`,
      `"${deckCard.card.set?.name?.replace(/"/g, '""') || ''}"`,
      `"${deckCard.card.setNumber || ''}"`,
      deckCard.card.cost || '',
      `"${deckCard.card.type?.name?.replace(/"/g, '""') || ''}"`,
      `"${deckCard.card.rarity?.name?.replace(/"/g, '""') || ''}"`,
      `"${deckCard.card.faction?.replace(/"/g, '""') || ''}"`,
      `"${deckCard.card.pilot?.replace(/"/g, '""') || ''}"`,
      `"${deckCard.card.model?.replace(/"/g, '""') || ''}"`,
      `"${deckCard.category || 'main'}"`,
    ];

    csv += row.join(',') + '\n';
  }

  return csv;
}
