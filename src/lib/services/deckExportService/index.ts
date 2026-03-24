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
import type { CardSchemaCustomField } from '@/lib/types/game';
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
   * Import deck from various formats.
   *
   * Pass `customFields` from the active game's config to route game-specific
   * columns/properties into `card.gameAttributes` rather than deprecated flat columns.
   */
  importDeck(
    content: string,
    format: string,
    customFields: CardSchemaCustomField[] = []
  ): ImportResult {
    try {
      switch (format) {
        case 'json':
          return importFromJSON(content, customFields);
        case 'text':
          return importFromText(content);
        case 'csv':
          return importFromCSV(content, customFields);
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
