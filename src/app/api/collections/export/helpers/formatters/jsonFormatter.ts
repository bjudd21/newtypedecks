/**
 * JSON Export Formatter
 *
 * Generates structured JSON format exports of collection data
 */

import type {
  CollectionCardData,
  ExportOptions,
  ExportResult,
  JSONExportData,
  ExportCardData,
} from '../types';

/**
 * Generate comprehensive JSON export with full metadata
 */
export function generateJSONExport(
  collectionCards: CollectionCardData[],
  options: ExportOptions,
  timestamp: string
): ExportResult {
  const exportData: JSONExportData = {
    exportInfo: {
      format: 'gundam-card-game-collection',
      version: '1.0',
      exportedAt: timestamp,
      exportedBy: options.userId,
      recordCount: collectionCards.length,
      exportOptions: options,
    },
    collection: collectionCards.map((collectionCard) => {
      const card = collectionCard.card;
      const exportCard: ExportCardData = {
        cardId: card.id,
        cardName: card.name,
        quantity: collectionCard.quantity,
        set: {
          name: card.set?.name,
          code: card.set?.code,
          number: card.setNumber,
        },
        cardInfo: {
          type: card.type?.name,
          rarity: card.rarity?.name,
          cost: card.cost,
          description: card.description,
        },
      };

      if (options.includeConditions) {
        exportCard.condition = collectionCard.condition || 'Near Mint';
      }

      if (options.includeValues) {
        exportCard.marketPrice = card.marketPrice || 0;
        exportCard.totalValue =
          (card.marketPrice || 0) * collectionCard.quantity;
      }

      if (options.includeMetadata) {
        exportCard.metadata = {
          addedDate: collectionCard.createdAt,
          lastUpdated: collectionCard.updatedAt,
        };
      }

      // Include custom fields if specified
      if (options.customFields && options.customFields.length > 0) {
        exportCard.customData = {};
        options.customFields.forEach((field: string) => {
          if (card[field] !== undefined) {
            exportCard.customData![field] = card[field];
          }
        });
      }

      return exportCard;
    }),
  };

  return {
    content: JSON.stringify(exportData, null, 2),
    contentType: 'application/json',
    filename: `gundam-collection-${new Date().toISOString().split('T')[0]}.json`,
  };
}
