/**
 * Text Export Format
 */

import type { ExportableDeck, ExportOptions, DeckCard } from '../types';
import { sortCards } from '../utils';

/**
 * Export to human-readable text format
 */
export function exportToText(deck: ExportableDeck, options: ExportOptions): string {
  let output = `# ${deck.name}\n`;

  if (deck.description) {
    output += `\n${deck.description}\n`;
  }

  if (options.includeStats && deck.metadata) {
    output += '\n## Deck Statistics\n';
    output += `Total Cards: ${deck.metadata.totalCards}\n`;
    output += `Unique Cards: ${deck.metadata.uniqueCards}\n`;
    output += `Total Cost: ${deck.metadata.totalCost}\n`;

    if (deck.metadata.factions.length > 0) {
      output += `Factions: ${deck.metadata.factions.join(', ')}\n`;
    }

    if (deck.metadata.sets.length > 0) {
      output += `Sets: ${deck.metadata.sets.join(', ')}\n`;
    }

    output += '\n';
  }

  if (options.groupByType) {
    // Group by card type
    const cardsByType = new Map<string, DeckCard[]>();

    for (const deckCard of deck.cards) {
      const type = deckCard.card.type?.name || 'Unknown';
      if (!cardsByType.has(type)) {
        cardsByType.set(type, []);
      }
      cardsByType.get(type)!.push(deckCard);
    }

    for (const [type, cards] of cardsByType.entries()) {
      const sortedCards = sortCards(cards, options);
      const typeTotal = sortedCards.reduce(
        (sum, card) => sum + card.quantity,
        0
      );

      output += `## ${type} (${typeTotal} cards)\n`;

      for (const deckCard of sortedCards) {
        output += `${deckCard.quantity}x ${deckCard.card.name}`;

        if (deckCard.card.set?.name) {
          output += ` (${deckCard.card.set.name})`;
        }

        if (deckCard.card.cost !== null && deckCard.card.cost !== undefined) {
          output += ` [${deckCard.card.cost}]`;
        }

        output += '\n';
      }

      output += '\n';
    }
  } else {
    // Simple list format
    output += `## Main Deck (${deck.metadata?.totalCards || 0} cards)\n\n`;

    const sortedCards = sortCards(deck.cards, options);

    for (const deckCard of sortedCards) {
      output += `${deckCard.quantity}x ${deckCard.card.name}`;

      if (deckCard.card.set?.name) {
        output += ` (${deckCard.card.set.name})`;
      }

      if (deckCard.card.cost !== null && deckCard.card.cost !== undefined) {
        output += ` [${deckCard.card.cost}]`;
      }

      output += '\n';
    }
  }

  output += `\n---\nExported from Gundam Card Game Builder on ${new Date().toLocaleDateString()}\n`;

  return output;
}
