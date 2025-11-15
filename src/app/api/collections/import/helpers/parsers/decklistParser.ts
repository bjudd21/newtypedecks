/**
 * Decklist Parser for Collection Import
 *
 * Parses decklist format (quantity cardname)
 */

import type { ImportCard } from '../types';

/**
 * Parse deck list format data into ImportCard array
 * Supports patterns like "3 Lightning Bolt" or "1x Storm Crow"
 * Ignores comment lines starting with // or #
 */
export function parseDeckListData(deckListData: string): ImportCard[] {
  const lines = deckListData.trim().split('\n');
  const importCards: ImportCard[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (
      !trimmedLine ||
      trimmedLine.startsWith('//') ||
      trimmedLine.startsWith('#')
    )
      continue;

    // Match patterns like "3 Lightning Bolt" or "1x Storm Crow"
    const match = trimmedLine.match(/^(\d+)x?\s+(.+)$/);
    if (match) {
      const quantity = parseInt(match[1]);
      const cardName = match[2].trim();

      if (cardName && quantity > 0) {
        importCards.push({ cardName, quantity });
      }
    }
  }

  return importCards;
}
