/**
 * Decklist Export Formatter
 *
 * Generates deck list format exports compatible with deck building tools
 */

import type {
  CollectionCardData,
  ExportOptions,
  ExportResult,
} from '../types';

/**
 * Generate deck list format export (simple quantity + card name)
 */
export function generateDeckListExport(
  collectionCards: CollectionCardData[],
  _options: ExportOptions
): ExportResult {
  const lines: string[] = [];

  lines.push('// Gundam Card Game Collection');
  lines.push(`// Exported: ${new Date().toLocaleDateString()}`);
  lines.push('// Format: Quantity Card Name');
  lines.push('');

  collectionCards.forEach((collectionCard) => {
    const card = collectionCard.card;
    lines.push(`${collectionCard.quantity} ${card.name}`);
  });

  return {
    content: lines.join('\n'),
    contentType: 'text/plain',
    filename: `gundam-collection-decklist-${new Date().toISOString().split('T')[0]}.txt`,
  };
}
