/**
 * MTGA Parser for Collection Import
 *
 * Parses MTG Arena format data
 */

import type { ImportCard } from '../types';

/**
 * Parse MTG Arena format data into ImportCard array
 * Format: "3 Lightning Bolt (M21) 168"
 */
export function parseMTGAData(mtgaData: string): ImportCard[] {
  const lines = mtgaData.trim().split('\n');
  const importCards: ImportCard[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // MTG Arena format: "3 Lightning Bolt (M21) 168"
    const match = trimmedLine.match(
      /^(\d+)\s+([^(]+)(?:\(([^)]+)\)\s*(\w+)?)?/
    );
    if (match) {
      const quantity = parseInt(match[1]);
      const cardName = match[2].trim();
      const setCode = match[3]?.trim();
      const setNumber = match[4]?.trim();

      if (cardName && quantity > 0) {
        importCards.push({
          cardName,
          quantity,
          setName: setCode,
          setNumber: setNumber,
        });
      }
    }
  }

  return importCards;
}
