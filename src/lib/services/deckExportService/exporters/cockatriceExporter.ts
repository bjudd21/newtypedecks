/**
 * Cockatrice Format Export
 */

import type { ExportableDeck, ExportOptions } from '../types';
import { sortCards, escapeXML } from '../utils';

/**
 * Export to Cockatrice format
 */
export function exportToCockatriceFormat(
  deck: ExportableDeck,
  options: ExportOptions
): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<cockatrice_deck version="1">\n';
  xml += `  <deckname>${escapeXML(deck.name)}</deckname>\n`;
  xml += `  <comments>${escapeXML(deck.description || '')}</comments>\n`;
  xml += '  <zone name="main">\n';

  const sortedCards = sortCards(deck.cards, options);

  for (const deckCard of sortedCards) {
    xml += `    <card number="${deckCard.quantity}" name="${escapeXML(deckCard.card.name)}"/>\n`;
  }

  xml += '  </zone>\n';
  xml += '</cockatrice_deck>\n';

  return xml;
}
