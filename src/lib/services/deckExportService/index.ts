/**
 * Deck Export/Import Service
 *
 * Handles exporting and importing decks in various formats for anonymous users
 */

export type {
  DeckCard,
  ExportableDeck,
  ExportOptions,
  ImportResult,
} from './types';

import type { ExportableDeck, ExportOptions, ImportResult } from './types';
import {
  enrichDeckWithMetadata,
  generateFilename,
  getMimeType,
  downloadFile,
} from './utils';
import {
  exportToJSON,
  exportToText,
  exportToCSV,
  exportToMTGAFormat,
  exportToCockatriceFormat,
} from './exporters';
import { importFromJSON, importFromText, importFromCSV } from './importers';

export class DeckExportService {
  private static instance: DeckExportService;

  private constructor() {}

  public static getInstance(): DeckExportService {
    if (!DeckExportService.instance) {
      DeckExportService.instance = new DeckExportService();
    }
    return DeckExportService.instance;
  }

  /**
   * Export deck to various formats
   */
  exportDeck(deck: ExportableDeck, options: ExportOptions): string {
    const enrichedDeck = enrichDeckWithMetadata(deck);

    switch (options.format) {
      case 'json':
        return exportToJSON(enrichedDeck, options);
      case 'text':
        return exportToText(enrichedDeck, options);
      case 'csv':
        return exportToCSV(enrichedDeck, options);
      case 'mtga':
        return exportToMTGAFormat(enrichedDeck, options);
      case 'cockatrice':
        return exportToCockatriceFormat(enrichedDeck, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Download deck as file
   */
  downloadDeck(deck: ExportableDeck, options: ExportOptions): void {
    const content = this.exportDeck(deck, options);
    const filename = generateFilename(deck.name, options.format);
    const mimeType = getMimeType(options.format);

    downloadFile(content, filename, mimeType);
  }

  /**
   * Import deck from various formats
   */
  importDeck(content: string, format: string): ImportResult {
    try {
      switch (format) {
        case 'json':
          return importFromJSON(content);
        case 'text':
          return importFromText(content);
        case 'csv':
          return importFromCSV(content);
        default:
          return {
            success: false,
            errors: [`Unsupported import format: ${format}`],
            warnings: [],
          };
      }
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        warnings: [],
      };
    }
  }
}

// Export singleton instance
export const deckExporter = DeckExportService.getInstance();
