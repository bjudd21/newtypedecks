/**
 * CSV Export Format
 */

import type { ExportableDeck, ExportOptions, DeckCard } from '../types';
import { sortCards } from '../utils';

/**
 * Build CSV headers
 */
function buildCSVHeaders(): string {
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
  return headers.join(',') + '\n';
}

/**
 * Escape CSV value (handle quotes and nulls)
 */
function escapeCSVValue(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Build a CSV row for a deck card
 */
function buildCardRow(deckCard: DeckCard): string {
  const row = [
    deckCard.quantity,
    escapeCSVValue(deckCard.card.name),
    escapeCSVValue(deckCard.card.set?.name),
    escapeCSVValue(deckCard.card.setNumber),
    deckCard.card.cost || '',
    escapeCSVValue(deckCard.card.type?.name),
    escapeCSVValue(deckCard.card.rarity?.name),
    escapeCSVValue(deckCard.card.faction),
    escapeCSVValue(deckCard.card.pilot),
    escapeCSVValue(deckCard.card.model),
    escapeCSVValue(deckCard.category || 'main'),
  ];

  return row.join(',') + '\n';
}

/**
 * Export to CSV format
 */
export function exportToCSV(
  deck: ExportableDeck,
  options: ExportOptions
): string {
  let csv = buildCSVHeaders();

  const sortedCards = sortCards(deck.cards, options);
  for (const deckCard of sortedCards) {
    csv += buildCardRow(deckCard);
  }

  return csv;
}
