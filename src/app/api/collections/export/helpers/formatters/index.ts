/**
 * Export Format Generator
 *
 * Main dispatcher for generating exports in various formats
 */

import type { CollectionCardData, ExportOptions, ExportResult } from '../types';
import { generateCSVExport } from './csvFormatter';
import { generateJSONExport } from './jsonFormatter';
import { generateTextExport } from './textFormatter';
import { generateDeckListExport } from './decklistFormatter';
import { generateExcelExport } from './excelFormatter';

/**
 * Generate export data in the specified format
 * @param collectionCards - Array of collection card data
 * @param format - Export format (csv, json, xlsx, txt, decklist)
 * @param options - Export options and configuration
 * @returns Export result with content, content type, and filename
 * @throws Error if format is unsupported
 */
export async function generateExportData(
  collectionCards: CollectionCardData[],
  format: string,
  options: ExportOptions = {}
): Promise<ExportResult> {
  const timestamp = new Date().toISOString();

  switch (format.toLowerCase()) {
    case 'csv':
      return generateCSVExport(collectionCards, options);
    case 'json':
      return generateJSONExport(collectionCards, options, timestamp);
    case 'xlsx':
      return generateExcelExport(collectionCards, options);
    case 'txt':
      return generateTextExport(collectionCards, options);
    case 'decklist':
      return generateDeckListExport(collectionCards, options);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

// Re-export individual formatters for direct use if needed
export {
  generateCSVExport,
  generateJSONExport,
  generateTextExport,
  generateDeckListExport,
  generateExcelExport,
};
