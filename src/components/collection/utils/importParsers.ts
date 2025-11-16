/**
 * Import Parsers Utilities
 * Parsing functions for different collection import formats (CSV, JSON, Decklist)
 */

import type { PreviewCard } from '@/lib/types';

export interface ValidationError {
  line: number;
  error: string;
  suggestion?: string;
}

export interface ParseResult {
  errors: ValidationError[];
  preview: PreviewCard[];
}

/**
 * Detect CSV header and return start index
 * @param lines Array of CSV lines
 * @returns Index to start parsing (0 if no header, 1 if header detected)
 */
export function detectCSVHeader(lines: string[]): number {
  const firstLine = lines[0]?.toLowerCase();
  if (
    firstLine &&
    (firstLine.includes('name') ||
      firstLine.includes('card') ||
      firstLine.includes('quantity'))
  ) {
    return 1;
  }
  return 0;
}

/**
 * Parse a single CSV line
 * @param line CSV line to parse
 * @param lineNumber Line number for error reporting
 * @returns Object with either error or preview data
 */
export function parseCSVLine(
  line: string,
  lineNumber: number
): { error?: ValidationError; preview?: PreviewCard } {
  if (!line) return {};

  const parts = line.includes('\t') ? line.split('\t') : line.split(',');

  if (parts.length < 2) {
    return {
      error: {
        line: lineNumber,
        error: 'Insufficient columns',
        suggestion: 'Each line should have at least card name and quantity',
      },
    };
  }

  const cardName = parts[0]?.trim().replace(/^["']|["']$/g, '');
  const quantity = parseInt(parts[1]?.trim()) || 0;

  if (!cardName) {
    return { error: { line: lineNumber, error: 'Missing card name' } };
  }

  if (quantity <= 0) {
    return {
      error: {
        line: lineNumber,
        error: 'Invalid quantity',
        suggestion: 'Quantity must be a positive number',
      },
    };
  }

  return {
    preview: {
      line: lineNumber,
      cardName,
      quantity,
      setName: parts[2]?.trim().replace(/^["']|["']$/g, ''),
      setNumber: parts[3]?.trim().replace(/^["']|["']$/g, ''),
    },
  };
}

/**
 * Parse CSV format data
 * @param data Raw CSV data string
 * @returns Parse result with errors and preview
 */
export function parseCSVData(data: string): ParseResult {
  const errors: ValidationError[] = [];
  const preview: PreviewCard[] = [];
  const lines = data.trim().split('\n');
  const startIndex = detectCSVHeader(lines);

  for (let i = startIndex; i < Math.min(lines.length, startIndex + 10); i++) {
    const result = parseCSVLine(lines[i].trim(), i + 1);
    if (result.error) {
      errors.push(result.error);
    } else if (result.preview) {
      preview.push(result.preview);
    }
  }

  return { errors, preview };
}

/**
 * Parse JSON format data
 * @param data Raw JSON data string
 * @returns Parse result with errors and preview
 */
export function parseJSONData(data: string): ParseResult {
  const errors: ValidationError[] = [];
  const preview: PreviewCard[] = [];

  const jsonData = JSON.parse(data);
  if (!Array.isArray(jsonData)) {
    errors.push({
      line: 1,
      error: 'Data must be an array of card objects',
    });
    return { errors, preview };
  }

  for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
    const item = jsonData[i];
    const cardName = item.cardName || item.name;
    const quantity = parseInt(item.quantity) || parseInt(item.count) || 0;

    if (!cardName) {
      errors.push({
        line: i + 1,
        error: 'Missing card name in object',
      });
      continue;
    }

    if (quantity <= 0) {
      errors.push({
        line: i + 1,
        error: 'Invalid quantity in object',
      });
      continue;
    }

    preview.push({
      line: i + 1,
      cardName,
      quantity,
      setName: item.setName || item.set,
      cardId: item.cardId || item.id,
    });
  }

  return { errors, preview };
}

/**
 * Parse decklist format data
 * @param data Raw decklist data string
 * @returns Parse result with errors and preview
 */
export function parseDecklistData(data: string): ParseResult {
  const errors: ValidationError[] = [];
  const preview: PreviewCard[] = [];
  const lines = data.trim().split('\n');

  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('//') || line.startsWith('#')) continue;

    const match = line.match(/^(\d+)x?\s+(.+)$/);
    if (!match) {
      errors.push({
        line: i + 1,
        error: 'Invalid format',
        suggestion: 'Use format like "3 Card Name" or "2x Card Name"',
      });
      continue;
    }

    const quantity = parseInt(match[1]);
    const cardName = match[2].trim();

    if (quantity <= 0) {
      errors.push({ line: i + 1, error: 'Invalid quantity' });
      continue;
    }

    if (!cardName) {
      errors.push({ line: i + 1, error: 'Missing card name' });
      continue;
    }

    preview.push({
      line: i + 1,
      cardName,
      quantity,
    });
  }

  return { errors, preview };
}
