/**
 * Import Format Parsers
 *
 * Main dispatcher for parsing import data in various formats
 */

import type { ImportCard } from '../types';
import { parseCSVData } from './csvParser';
import { parseJSONData } from './jsonParser';
import { parseDeckListData } from './decklistParser';
import { parseMTGAData } from './mtgaParser';

/**
 * Parse import data based on the specified format
 * @param format - Import format (csv, json, decklist, mtga)
 * @param data - Import data string or object
 * @returns Array of ImportCard objects
 * @throws Error if format is unsupported
 */
export async function parseImportData(
  format: string,
  data: string | unknown
): Promise<ImportCard[]> {
  switch (format.toLowerCase()) {
    case 'csv':
      return await parseCSVData(data as string);
    case 'json':
      return parseJSONData(data);
    case 'decklist':
      return parseDeckListData(data as string);
    case 'mtga':
      return parseMTGAData(data as string);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

// Re-export individual parsers for direct use if needed
export { parseCSVData, parseJSONData, parseDeckListData, parseMTGAData };
