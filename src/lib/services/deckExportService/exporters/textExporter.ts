/**
 * Text Export Format
 */

import type { ExportableDeck, ExportOptions, DeckCard } from '../types';
import { sortCards } from '../utils';

/**
 * Build deck header with name and description
 */
function buildDeckHeader(deck: ExportableDeck): string {
  let output = `# ${deck.name}\n`;
  if (deck.description) {
    output += `\n${deck.description}\n`;
  }
  return output;
}

/**
 * Build statistics section
 */
function buildStatsSection(deck: ExportableDeck): string {
  if (!deck.metadata) {
    return '';
  }

  let output = '\n## Deck Statistics\n';
  output += `Total Cards: ${deck.metadata.totalCards}\n`;
  output += `Unique Cards: ${deck.metadata.uniqueCards}\n`;
  output += `Total Cost: ${deck.metadata.totalCost}\n`;

  if (deck.metadata.factions.length > 0) {
    output += `Factions: ${deck.metadata.factions.join(', ')}\n`;
  }

  if (deck.metadata.sets.length > 0) {
    output += `Sets: ${deck.metadata.sets.join(', ')}\n`;
  }

  return output + '\n';
}

/**
 * Format a single card line
 */
function formatCardLine(deckCard: DeckCard): string {
  let line = `${deckCard.quantity}x ${deckCard.card.name}`;

  if (deckCard.card.set?.name) {
    line += ` (${deckCard.card.set.name})`;
  }

  if (deckCard.card.cost !== null && deckCard.card.cost !== undefined) {
    line += ` [${deckCard.card.cost}]`;
  }

  return line + '\n';
}

/**
 * Build cards grouped by type
 */
function buildGroupedByType(
  deck: ExportableDeck,
  options: ExportOptions
): string {
  const cardsByType = new Map<string, DeckCard[]>();

  for (const deckCard of deck.cards) {
    const type = deckCard.card.type?.name || 'Unknown';
    if (!cardsByType.has(type)) {
      cardsByType.set(type, []);
    }
    cardsByType.get(type)!.push(deckCard);
  }

  let output = '';
  for (const [type, cards] of cardsByType.entries()) {
    const sortedCards = sortCards(cards, options);
    const typeTotal = sortedCards.reduce((sum, card) => sum + card.quantity, 0);

    output += `## ${type} (${typeTotal} cards)\n`;
    for (const deckCard of sortedCards) {
      output += formatCardLine(deckCard);
    }
    output += '\n';
  }

  return output;
}

/**
 * Build simple card list
 */
function buildSimpleList(deck: ExportableDeck, options: ExportOptions): string {
  const totalCards = deck.metadata?.totalCards || 0;
  let output = `## Main Deck (${totalCards} cards)\n\n`;

  const sortedCards = sortCards(deck.cards, options);
  for (const deckCard of sortedCards) {
    output += formatCardLine(deckCard);
  }

  return output;
}

/**
 * Build export footer
 */
function buildFooter(gameName: string): string {
  const date = new Date().toLocaleDateString();
  return `\n---\nExported from ${gameName} Builder on ${date}\n`;
}

/**
 * Export to human-readable text format
 */
export function exportToText(
  deck: ExportableDeck,
  options: ExportOptions
): string {
  let output = buildDeckHeader(deck);

  if (options.includeStats) {
    output += buildStatsSection(deck);
  }

  if (options.groupByType) {
    output += buildGroupedByType(deck, options);
  } else {
    output += buildSimpleList(deck, options);
  }

  output += buildFooter(options.gameName ?? 'Card Game');

  return output;
}
