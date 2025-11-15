/**
 * JSON Parser for Collection Import
 *
 * Parses JSON array format data
 */

import type { ImportCard } from '../types';

/**
 * Parse JSON data into ImportCard array
 * Accepts various field name variations (cardId/id, cardName/name, etc.)
 */
export function parseJSONData(jsonData: unknown): ImportCard[] {
  if (!Array.isArray(jsonData)) {
    throw new Error('JSON data must be an array of card objects');
  }

  return jsonData
    .map((item: unknown) => {
      const itemObj = item as Record<string, unknown>;
      return {
        cardId: (itemObj.cardId || itemObj.id) as string | undefined,
        cardName: (itemObj.cardName || itemObj.name) as string | undefined,
        quantity: parseInt(String(itemObj.quantity || itemObj.count || 1)),
        setName:
          (itemObj.setName as string | undefined) ||
          (itemObj.set as string | undefined),
        setNumber:
          (itemObj.setNumber as string | undefined) ||
          (itemObj.number as string | undefined),
      };
    })
    .filter((card) => card.quantity > 0);
}
