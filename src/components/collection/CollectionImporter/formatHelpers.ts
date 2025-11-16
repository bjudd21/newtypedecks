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
      return "RX-78-2 Gundam,2,Mobile Suit Gundam,MSG-001\nChar's Zaku II,1,Mobile Suit Gundam,MSG-002";
    case 'json':
      return '[{"cardName":"RX-78-2 Gundam","quantity":2,"setName":"Mobile Suit Gundam"},{"cardName":"Char\'s Zaku II","quantity":1}]';
    case 'decklist':
      return "2 RX-78-2 Gundam\n1 Char's Zaku II\n3x Nu Gundam";
    case 'mtga':
      return "2 RX-78-2 Gundam (MSG) 001\n1 Char's Zaku II (MSG) 002";
    default:
      return '';
  }
}
