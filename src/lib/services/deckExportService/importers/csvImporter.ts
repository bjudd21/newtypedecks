/**
 * CSV Import Parser
 */

import type { CardWithRelations } from '@/lib/types/card';
import type { ImportResult, ExportableDeck, DeckCard } from '../types';

/**
 * Import from CSV format
 */
export function importFromCSV(content: string): ImportResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return {
      success: false,
      errors: ['CSV must have at least a header row and one data row'],
      warnings: [],
    };
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
  const cards: DeckCard[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));

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

    const rowObj = row as Record<string, unknown>;
    cards.push({
      card: {
        id: `import-${Date.now()}-${i}`,
        name,
        cost: rowObj.cost ? parseInt(String(rowObj.cost)) : null,
        setNumber:
          (rowObj['set number'] as string) ||
          (rowObj.setnumber as string) ||
          '',
        type: rowObj.type ? { name: rowObj.type as string } : null,
        rarity: rowObj.rarity ? { name: rowObj.rarity as string } : null,
        set: rowObj.set ? { name: rowObj.set as string } : null,
        faction: rowObj.faction as string | null,
        pilot: rowObj.pilot as string | null,
        model: rowObj.model as string | null,
      } as CardWithRelations,
      quantity,
      category: row.category || 'main',
    });
  }

  const deck: ExportableDeck = {
    name: 'CSV Import',
    cards,
    createdAt: new Date(),
  };

  return {
    success: cards.length > 0,
    deck: cards.length > 0 ? deck : undefined,
    errors,
    warnings,
  };
}
