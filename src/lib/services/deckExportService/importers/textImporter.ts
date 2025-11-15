/**
 * Text Import Parser
 */

import type { CardWithRelations } from '@/lib/types/card';
import type { ImportResult, ExportableDeck, DeckCard } from '../types';

/**
 * Import from text format
 */
export function importFromText(content: string): ImportResult {
  const errors: string[] = [];
  const warnings: string[] = [
    'Text import has limited functionality - only card names and quantities',
  ];

  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const cards: DeckCard[] = [];
  let deckName = 'Imported Deck';

  for (const line of lines) {
    // Skip comments and headers
    if (
      line.startsWith('#') ||
      line.startsWith('//') ||
      line.startsWith('--')
    ) {
      if (line.startsWith('# ')) {
        deckName = line.substring(2).trim();
      }
      continue;
    }

    // Parse card lines: "4x Card Name" or "4 Card Name"
    const match = line.match(
      /^(\d+)x?\s+(.+?)(?:\s*\([^)]+\))?(?:\s*\[[^\]]+\])?$/
    );

    if (match) {
      const [, quantityStr, cardName] = match;
      const quantity = parseInt(quantityStr);

      if (quantity > 0 && quantity <= 10) {
        // Create a minimal card object (would need to be resolved against database)
        cards.push({
          card: {
            id: `import-${Date.now()}-${Math.random()}`,
            name: cardName.trim(),
            cost: null,
            setNumber: '',
            type: null,
            rarity: null,
            set: null,
          } as unknown as CardWithRelations,
          quantity,
          category: 'main',
        });
      } else {
        warnings.push(`Invalid quantity for "${cardName}": ${quantity}`);
      }
    } else if (line.match(/\w/)) {
      warnings.push(`Could not parse line: "${line}"`);
    }
  }

  if (cards.length === 0) {
    errors.push('No valid cards found in text format');
  }

  const deck: ExportableDeck = {
    name: deckName,
    cards,
    createdAt: new Date(),
  };

  return {
    success: errors.length === 0,
    deck: errors.length === 0 ? deck : undefined,
    errors,
    warnings,
  };
}
