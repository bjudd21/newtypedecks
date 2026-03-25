/**
 * CSV Export Format
 */

import type { ExportableDeck, ExportOptions, DeckCard } from '../types';
import type { CardSchemaCustomField } from '@/lib/types/game';
import { sortCards } from '../utils';

/**
 * Read a field from a card's gameAttributes JSONB.
 * Returns null (for escapeCSVValue compatibility) if absent.
 */
function getGameAttr(
  attrs: DeckCard['card']['gameAttributes'],
  field: string
): string | null {
  if (!attrs || typeof attrs !== 'object' || Array.isArray(attrs)) return null;
  const value = (attrs as Record<string, unknown>)[field];
  return value != null ? String(value) : null;
}

/**
 * Escape CSV value (handle quotes and nulls)
 */
function escapeCSVValue(value: string | null | undefined): string {
  if (!value) return '';
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Build CSV headers — base columns plus one column per game-specific custom field.
 */
function buildCSVHeaders(customFields: CardSchemaCustomField[]): string {
  const headers = [
    'Quantity',
    'Name',
    'Set',
    'Set Number',
    'Cost',
    'Type',
    'Rarity',
    ...customFields.map((f) => f.label),
    'Category',
  ];
  return headers.join(',') + '\n';
}

/**
 * Build a CSV row — base columns followed by dynamic game-attribute columns.
 */
function buildCardRow(
  deckCard: DeckCard,
  customFields: CardSchemaCustomField[]
): string {
  const row = [
    deckCard.quantity,
    escapeCSVValue(deckCard.card.name),
    escapeCSVValue(deckCard.card.set?.name),
    escapeCSVValue(deckCard.card.setNumber),
    deckCard.card.cost || '',
    escapeCSVValue(deckCard.card.type?.name),
    escapeCSVValue(deckCard.card.rarity?.name),
    ...customFields.map((f) =>
      escapeCSVValue(getGameAttr(deckCard.card.gameAttributes, f.key))
    ),
    escapeCSVValue(deckCard.category || 'main'),
  ];

  return row.join(',') + '\n';
}

/**
 * Export to CSV format.
 * Game-specific columns are driven by options.customFields — pass the active
 * game's config.schema.customFields for correct per-game column headers.
 */
export function exportToCSV(
  deck: ExportableDeck,
  options: ExportOptions
): string {
  const customFields = options.customFields ?? [];
  let csv = buildCSVHeaders(customFields);

  const sortedCards = sortCards(deck.cards, options);
  for (const deckCard of sortedCards) {
    csv += buildCardRow(deckCard, customFields);
  }

  return csv;
}
