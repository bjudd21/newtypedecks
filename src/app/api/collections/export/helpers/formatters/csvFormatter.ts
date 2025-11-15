/**
 * CSV Export Formatter
 *
 * Generates CSV format exports of collection data
 */

import type {
  CollectionCardData,
  ExportOptions,
  ExportResult,
} from '../types';

/**
 * Generate CSV export with optional metadata, conditions, and values
 */
export function generateCSVExport(
  collectionCards: CollectionCardData[],
  options: ExportOptions
): ExportResult {
  const headers = [
    'Card Name',
    'Quantity',
    'Set Name',
    'Set Number',
    'Type',
    'Rarity',
  ];

  if (options.includeConditions) {
    headers.push('Condition');
  }
  if (options.includeValues) {
    headers.push('Market Price', 'Total Value');
  }
  if (options.includeMetadata) {
    headers.push('Added Date', 'Last Updated');
  }

  const rows = [headers.join(',')];

  collectionCards.forEach((collectionCard) => {
    const card = collectionCard.card;
    const row = [
      `"${card.name}"`,
      collectionCard.quantity,
      `"${card.set?.name || ''}"`,
      `"${card.setNumber || ''}"`,
      `"${card.type?.name || ''}"`,
      `"${card.rarity?.name || ''}"`,
    ];

    if (options.includeConditions) {
      row.push(`"${collectionCard.condition || 'Near Mint'}"`);
    }
    if (options.includeValues) {
      const marketPrice = card.marketPrice || 0;
      const totalValue = marketPrice * collectionCard.quantity;
      row.push(marketPrice.toString(), totalValue.toString());
    }
    if (options.includeMetadata) {
      row.push(
        `"${collectionCard.createdAt}"`,
        `"${collectionCard.updatedAt}"`
      );
    }

    rows.push(row.join(','));
  });

  return {
    content: rows.join('\n'),
    contentType: 'text/csv',
    filename: `gundam-collection-${new Date().toISOString().split('T')[0]}.csv`,
  };
}
