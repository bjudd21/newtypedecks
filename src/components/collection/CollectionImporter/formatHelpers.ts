/**
 * Format Helper Functions
 * Utilities for import format descriptions and examples
 */

export function getFormatDescription(format: string): string {
  switch (format) {
    case 'csv':
      return 'CSV/TSV format with columns: Card Name, Quantity, Set Name (optional), Set Number (optional)';
    case 'json':
      return 'JSON array with objects containing cardName/name, quantity/count, and optional setName/set';
    case 'decklist':
      return 'Simple deck list format: "3 Lightning Bolt" or "1x Storm Crow" (one per line)';
    case 'mtga':
      return 'MTG Arena export format: "3 Lightning Bolt (M21) 168"';
    default:
      return '';
  }
}

export function getFormatExample(format: string): string {
  switch (format) {
    case 'csv':
      return 'Card Alpha,2,Base Set,BS-001\nCard Beta,1,Base Set,BS-002';
    case 'json':
      return '[{"cardName":"Card Alpha","quantity":2,"setName":"Base Set"},{"cardName":"Card Beta","quantity":1}]';
    case 'decklist':
      return '2 Card Alpha\n1 Card Beta\n3x Card Gamma';
    case 'mtga':
      return '2 Card Alpha (BS) 001\n1 Card Beta (BS) 002';
    default:
      return '';
  }
}
