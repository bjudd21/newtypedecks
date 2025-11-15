/**
 * CSV Parser for Collection Import
 *
 * Parses CSV format data (Name, Quantity, Set, Set Number)
 */

import type { ImportCard } from '../types';

/**
 * Parse CSV data into ImportCard array
 * Supports both comma and tab-separated values
 * Auto-detects and skips header row
 */
export async function parseCSVData(csvData: string): Promise<ImportCard[]> {
  const lines = csvData.trim().split('\n');
  const importCards: ImportCard[] = [];

  // Skip header if it exists
  let startIndex = 0;
  if (
    lines[0] &&
    (lines[0].toLowerCase().includes('name') ||
      lines[0].toLowerCase().includes('card'))
  ) {
    startIndex = 1;
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Support both comma and tab separation
    const parts = line.includes('\t') ? line.split('\t') : line.split(',');

    if (parts.length < 2) continue;

    const cardName = parts[0]?.trim().replace(/^["']|["']$/g, ''); // Remove quotes
    const quantity = parseInt(parts[1]?.trim()) || 0;
    const setName = parts[2]?.trim().replace(/^["']|["']$/g, '');
    const setNumber = parts[3]?.trim().replace(/^["']|["']$/g, '');

    if (cardName && quantity > 0) {
      importCards.push({
        cardName,
        quantity,
        setName: setName || undefined,
        setNumber: setNumber || undefined,
      });
    }
  }

  return importCards;
}
