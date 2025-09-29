/**
 * Deck Export/Import Service
 *
 * Handles exporting and importing decks in various formats for anonymous users
 */

import type { CardWithRelations } from '@/lib/types/card';

export interface DeckCard {
  card: CardWithRelations;
  quantity: number;
  category?: string;
}

export interface ExportableDeck {
  name: string;
  description?: string;
  cards: DeckCard[];
  createdAt: Date;
  format?: string;
  metadata?: {
    totalCards: number;
    uniqueCards: number;
    totalCost: number;
    factions: string[];
    sets: string[];
  };
}

export interface ExportOptions {
  format: 'json' | 'text' | 'csv' | 'mtga' | 'cockatrice';
  includeMetadata?: boolean;
  includeStats?: boolean;
  groupByType?: boolean;
  sortBy?: 'name' | 'cost' | 'type' | 'quantity';
  sortOrder?: 'asc' | 'desc';
}

export interface ImportResult {
  success: boolean;
  deck?: ExportableDeck;
  errors: string[];
  warnings: string[];
}

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
    const enrichedDeck = this.enrichDeckWithMetadata(deck);

    switch (options.format) {
      case 'json':
        return this.exportToJSON(enrichedDeck, options);
      case 'text':
        return this.exportToText(enrichedDeck, options);
      case 'csv':
        return this.exportToCSV(enrichedDeck, options);
      case 'mtga':
        return this.exportToMTGAFormat(enrichedDeck, options);
      case 'cockatrice':
        return this.exportToCockatriceFormat(enrichedDeck, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Download deck as file
   */
  downloadDeck(deck: ExportableDeck, options: ExportOptions): void {
    const content = this.exportDeck(deck, options);
    const filename = this.generateFilename(deck.name, options.format);
    const mimeType = this.getMimeType(options.format);

    this.downloadFile(content, filename, mimeType);
  }

  /**
   * Import deck from various formats
   */
  importDeck(content: string, format: string): ImportResult {
    try {
      switch (format) {
        case 'json':
          return this.importFromJSON(content);
        case 'text':
          return this.importFromText(content);
        case 'csv':
          return this.importFromCSV(content);
        default:
          return {
            success: false,
            errors: [`Unsupported import format: ${format}`],
            warnings: []
          };
      }
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        warnings: []
      };
    }
  }

  /**
   * Enrich deck with calculated metadata
   */
  private enrichDeckWithMetadata(deck: ExportableDeck): ExportableDeck {
    const totalCards = deck.cards.reduce((sum, card) => sum + card.quantity, 0);
    const uniqueCards = deck.cards.length;
    const totalCost = deck.cards.reduce(
      (sum, deckCard) => sum + ((deckCard.card.cost || 0) * deckCard.quantity),
      0
    );

    const factions = Array.from(
      new Set(
        deck.cards
          .map(deckCard => deckCard.card.faction)
          .filter((faction): faction is string => Boolean(faction))
      )
    );

    const sets = Array.from(
      new Set(
        deck.cards
          .map(deckCard => deckCard.card.set?.name)
          .filter((setName): setName is string => Boolean(setName))
      )
    );

    return {
      ...deck,
      metadata: {
        totalCards,
        uniqueCards,
        totalCost,
        factions,
        sets
      }
    };
  }

  /**
   * Export to JSON format
   */
  private exportToJSON(deck: ExportableDeck, options: ExportOptions): string {
    const exportData = {
      name: deck.name,
      description: deck.description,
      createdAt: deck.createdAt.toISOString(),
      format: 'Gundam Card Game',
      ...(options.includeMetadata && { metadata: deck.metadata }),
      cards: this.sortCards(deck.cards, options).map(deckCard => ({
        id: deckCard.card.id,
        name: deckCard.card.name,
        quantity: deckCard.quantity,
        category: deckCard.category || 'main',
        set: deckCard.card.set?.name,
        setNumber: deckCard.card.setNumber,
        cost: deckCard.card.cost,
        type: deckCard.card.type?.name,
        rarity: deckCard.card.rarity?.name,
        faction: deckCard.card.faction,
        pilot: deckCard.card.pilot,
        model: deckCard.card.model
      }))
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export to human-readable text format
   */
  private exportToText(deck: ExportableDeck, options: ExportOptions): string {
    let output = `# ${deck.name}\n`;

    if (deck.description) {
      output += `\n${deck.description}\n`;
    }

    if (options.includeStats && deck.metadata) {
      output += '\n## Deck Statistics\n';
      output += `Total Cards: ${deck.metadata.totalCards}\n`;
      output += `Unique Cards: ${deck.metadata.uniqueCards}\n`;
      output += `Total Cost: ${deck.metadata.totalCost}\n`;

      if (deck.metadata.factions.length > 0) {
        output += `Factions: ${deck.metadata.factions.join(', ')}\n`;
      }

      if (deck.metadata.sets.length > 0) {
        output += `Sets: ${deck.metadata.sets.join(', ')}\n`;
      }

      output += '\n';
    }

    if (options.groupByType) {
      // Group by card type
      const cardsByType = new Map<string, DeckCard[]>();

      for (const deckCard of deck.cards) {
        const type = deckCard.card.type?.name || 'Unknown';
        if (!cardsByType.has(type)) {
          cardsByType.set(type, []);
        }
        cardsByType.get(type)!.push(deckCard);
      }

      for (const [type, cards] of cardsByType.entries()) {
        const sortedCards = this.sortCards(cards, options);
        const typeTotal = sortedCards.reduce((sum, card) => sum + card.quantity, 0);

        output += `## ${type} (${typeTotal} cards)\n`;

        for (const deckCard of sortedCards) {
          output += `${deckCard.quantity}x ${deckCard.card.name}`;

          if (deckCard.card.set?.name) {
            output += ` (${deckCard.card.set.name})`;
          }

          if (deckCard.card.cost !== null && deckCard.card.cost !== undefined) {
            output += ` [${deckCard.card.cost}]`;
          }

          output += '\n';
        }

        output += '\n';
      }
    } else {
      // Simple list format
      output += `## Main Deck (${deck.metadata?.totalCards || 0} cards)\n\n`;

      const sortedCards = this.sortCards(deck.cards, options);

      for (const deckCard of sortedCards) {
        output += `${deckCard.quantity}x ${deckCard.card.name}`;

        if (deckCard.card.set?.name) {
          output += ` (${deckCard.card.set.name})`;
        }

        if (deckCard.card.cost !== null && deckCard.card.cost !== undefined) {
          output += ` [${deckCard.card.cost}]`;
        }

        output += '\n';
      }
    }

    output += `\n---\nExported from Gundam Card Game Builder on ${new Date().toLocaleDateString()}\n`;

    return output;
  }

  /**
   * Export to CSV format
   */
  private exportToCSV(deck: ExportableDeck, options: ExportOptions): string {
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
      'Category'
    ];

    let csv = headers.join(',') + '\n';

    const sortedCards = this.sortCards(deck.cards, options);

    for (const deckCard of sortedCards) {
      const row = [
        deckCard.quantity,
        `"${deckCard.card.name.replace(/"/g, '""')}"`,
        `"${deckCard.card.set?.name?.replace(/"/g, '""') || ''}"`,
        `"${deckCard.card.setNumber || ''}"`,
        deckCard.card.cost || '',
        `"${deckCard.card.type?.name?.replace(/"/g, '""') || ''}"`,
        `"${deckCard.card.rarity?.name?.replace(/"/g, '""') || ''}"`,
        `"${deckCard.card.faction?.replace(/"/g, '""') || ''}"`,
        `"${deckCard.card.pilot?.replace(/"/g, '""') || ''}"`,
        `"${deckCard.card.model?.replace(/"/g, '""') || ''}"`,
        `"${deckCard.category || 'main'}"`
      ];

      csv += row.join(',') + '\n';
    }

    return csv;
  }

  /**
   * Export to MTG Arena format (for compatibility with other deck builders)
   */
  private exportToMTGAFormat(deck: ExportableDeck, options: ExportOptions): string {
    let output = 'Deck\n';

    const sortedCards = this.sortCards(deck.cards, options);

    for (const deckCard of sortedCards) {
      // MTG Arena format: "4 Lightning Bolt (M11) 114"
      output += `${deckCard.quantity} ${deckCard.card.name}`;

      if (deckCard.card.set?.code && deckCard.card.setNumber) {
        output += ` (${deckCard.card.set.code}) ${deckCard.card.setNumber}`;
      }

      output += '\n';
    }

    return output;
  }

  /**
   * Export to Cockatrice format
   */
  private exportToCockatriceFormat(deck: ExportableDeck, options: ExportOptions): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<cockatrice_deck version="1">\n';
    xml += `  <deckname>${this.escapeXML(deck.name)}</deckname>\n`;
    xml += `  <comments>${this.escapeXML(deck.description || '')}</comments>\n`;
    xml += '  <zone name="main">\n';

    const sortedCards = this.sortCards(deck.cards, options);

    for (const deckCard of sortedCards) {
      xml += `    <card number="${deckCard.quantity}" name="${this.escapeXML(deckCard.card.name)}"/>\n`;
    }

    xml += '  </zone>\n';
    xml += '</cockatrice_deck>\n';

    return xml;
  }

  /**
   * Import from JSON format
   */
  private importFromJSON(content: string): ImportResult {
    try {
      const data = JSON.parse(content);
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!data.name) {
        errors.push('Deck name is required');
      }

      if (!data.cards || !Array.isArray(data.cards)) {
        errors.push('Cards array is required');
      }

      if (errors.length > 0) {
        return { success: false, errors, warnings };
      }

      // Convert imported card data back to DeckCard format
      const cards: DeckCard[] = data.cards.map((cardData: any) => ({
        card: {
          id: cardData.id,
          name: cardData.name,
          cost: cardData.cost,
          setNumber: cardData.setNumber,
          type: cardData.type ? { name: cardData.type } : null,
          rarity: cardData.rarity ? { name: cardData.rarity } : null,
          set: cardData.set ? { name: cardData.set } : null,
          faction: cardData.faction,
          pilot: cardData.pilot,
          model: cardData.model
        } as CardWithRelations,
        quantity: cardData.quantity,
        category: cardData.category
      }));

      const deck: ExportableDeck = {
        name: data.name,
        description: data.description,
        cards,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        metadata: data.metadata
      };

      return { success: true, deck, errors, warnings };
    } catch (error) {
      return {
        success: false,
        errors: ['Invalid JSON format'],
        warnings: []
      };
    }
  }

  /**
   * Import from text format
   */
  private importFromText(content: string): ImportResult {
    const errors: string[] = [];
    const warnings: string[] = ['Text import has limited functionality - only card names and quantities'];

    const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
    const cards: DeckCard[] = [];
    let deckName = 'Imported Deck';

    for (const line of lines) {
      // Skip comments and headers
      if (line.startsWith('#') || line.startsWith('//') || line.startsWith('--')) {
        if (line.startsWith('# ')) {
          deckName = line.substring(2).trim();
        }
        continue;
      }

      // Parse card lines: "4x Card Name" or "4 Card Name"
      const match = line.match(/^(\d+)x?\s+(.+?)(?:\s*\([^)]+\))?(?:\s*\[[^\]]+\])?$/);

      if (match) {
        const [, quantityStr, cardName] = match;
        const quantity = parseInt(quantityStr);

        if (quantity > 0 && quantity <= 10) {
          // Create a minimal card object (would need to be resolved against database)
          cards.push({
            card: {
              id: `import-${Date.now()}-${Math.random()}`,
              name: cardName.trim(),
              cost: null,
              setNumber: '',
              type: null,
              rarity: null,
              set: null
            } as any,
            quantity,
            category: 'main'
          });
        } else {
          warnings.push(`Invalid quantity for "${cardName}": ${quantity}`);
        }
      } else if (line.match(/\w/)) {
        warnings.push(`Could not parse line: "${line}"`);
      }
    }

    if (cards.length === 0) {
      errors.push('No valid cards found in text format');
    }

    const deck: ExportableDeck = {
      name: deckName,
      cards,
      createdAt: new Date()
    };

    return {
      success: errors.length === 0,
      deck: errors.length === 0 ? deck : undefined,
      errors,
      warnings
    };
  }

  /**
   * Import from CSV format
   */
  private importFromCSV(content: string): ImportResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const lines = content.split('\n').map(line => line.trim()).filter(Boolean);

    if (lines.length < 2) {
      return {
        success: false,
        errors: ['CSV must have at least a header row and one data row'],
        warnings: []
      };
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const cards: DeckCard[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));

      if (values.length !== headers.length) {
        warnings.push(`Row ${i + 1} has incorrect number of columns`);
        continue;
      }

      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header.toLowerCase()] = values[index];
      });

      const quantity = parseInt(row.quantity || '0');
      const name = row.name;

      if (!name || quantity <= 0) {
        warnings.push(`Row ${i + 1} missing name or valid quantity`);
        continue;
      }

      cards.push({
        card: {
          id: `import-${Date.now()}-${i}`,
          name,
          cost: row.cost ? parseInt(row.cost) : null,
          setNumber: row['set number'] || row.setnumber || '',
          type: row.type ? { name: row.type } : null,
          rarity: row.rarity ? { name: row.rarity } : null,
          set: row.set ? { name: row.set } : null,
          faction: row.faction,
          pilot: row.pilot,
          model: row.model
        } as any,
        quantity,
        category: row.category || 'main'
      });
    }

    const deck: ExportableDeck = {
      name: 'CSV Import',
      cards,
      createdAt: new Date()
    };

    return {
      success: cards.length > 0,
      deck: cards.length > 0 ? deck : undefined,
      errors,
      warnings
    };
  }

  /**
   * Sort cards based on options
   */
  private sortCards(cards: DeckCard[], options: ExportOptions): DeckCard[] {
    const sortBy = options.sortBy || 'name';
    const sortOrder = options.sortOrder || 'asc';

    return [...cards].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.card.name.localeCompare(b.card.name);
          break;
        case 'cost':
          comparison = (a.card.cost || 0) - (b.card.cost || 0);
          break;
        case 'type':
          comparison = (a.card.type?.name || '').localeCompare(b.card.type?.name || '');
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  /**
   * Generate filename for export
   */
  private generateFilename(deckName: string, format: string): string {
    const sanitizedName = deckName
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();

    const timestamp = new Date().toISOString().split('T')[0];
    const extension = this.getFileExtension(format);

    return `${sanitizedName}_${timestamp}.${extension}`;
  }

  /**
   * Get file extension for format
   */
  private getFileExtension(format: string): string {
    switch (format) {
      case 'json': return 'json';
      case 'text': return 'txt';
      case 'csv': return 'csv';
      case 'mtga': return 'txt';
      case 'cockatrice': return 'cod';
      default: return 'txt';
    }
  }

  /**
   * Get MIME type for format
   */
  private getMimeType(format: string): string {
    switch (format) {
      case 'json': return 'application/json';
      case 'csv': return 'text/csv';
      case 'cockatrice': return 'application/xml';
      default: return 'text/plain';
    }
  }

  /**
   * Download file to user's computer
   */
  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Escape XML special characters
   */
  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

// Export singleton instance
export const deckExporter = DeckExportService.getInstance();