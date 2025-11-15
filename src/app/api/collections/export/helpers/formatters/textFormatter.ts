/**
 * Text Export Formatter
 *
 * Generates simple human-readable text format exports
 */

import type { CollectionCardData, ExportOptions, ExportResult } from '../types';

/**
 * Generate simple text list export with optional metadata
 */
export function generateTextExport(
  collectionCards: CollectionCardData[],
  options: ExportOptions
): ExportResult {
  const lines: string[] = [];

  if (options.includeMetadata) {
    lines.push('# Gundam Card Game Collection Export');
    lines.push(`# Exported on: ${new Date().toISOString()}`);
    lines.push(
      `# Total Cards: ${collectionCards.reduce((sum, cc) => sum + cc.quantity, 0)}`
    );
    lines.push(`# Unique Cards: ${collectionCards.length}`);
    lines.push('');
  }

  collectionCards.forEach((collectionCard) => {
    const card = collectionCard.card;
    let line = `${collectionCard.quantity}x ${card.name}`;

    if (card.set?.name) {
      line += ` (${card.set.name}${card.setNumber ? ' #' + card.setNumber : ''})`;
    }

    if (options.includeConditions && collectionCard.condition) {
      line += ` [${collectionCard.condition}]`;
    }

    lines.push(line);
  });

  return {
    content: lines.join('\n'),
    contentType: 'text/plain',
    filename: `gundam-collection-${new Date().toISOString().split('T')[0]}.txt`,
  };
}
