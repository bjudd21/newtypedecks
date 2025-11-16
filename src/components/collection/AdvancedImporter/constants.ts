/**
 * Constants for AdvancedImporter
 */

import type { ImportSource } from './types';

export const IMPORT_SOURCES: ImportSource[] = [
  {
    id: 'manual_csv',
    name: 'CSV File',
    description: 'Comma-separated values with card data',
    icon: '📊',
    format: 'csv',
    example: 'Card Name,Quantity,Set,Number\nRX-78-2 Gundam,2,MSG,001',
  },
  {
    id: 'deck_export',
    name: 'Deck Export',
    description: 'Export from other deck building tools',
    icon: '🎯',
    format: 'decklist',
    example: "2 RX-78-2 Gundam\n1 Char's Zaku II\n3x Nu Gundam",
  },
  {
    id: 'collection_backup',
    name: 'Collection Backup',
    description: 'JSON backup from this or other applications',
    icon: '💾',
    format: 'json',
    example: '[{"name":"RX-78-2 Gundam","quantity":2,"set":"MSG"}]',
  },
  {
    id: 'inventory_list',
    name: 'Inventory List',
    description: 'Simple text list with quantities',
    icon: '📝',
    format: 'decklist',
    example: "2x RX-78-2 Gundam\n1x Char's Zaku II",
  },
  {
    id: 'spreadsheet',
    name: 'Spreadsheet Export',
    description: 'Tab-separated values from Excel/Sheets',
    icon: '📋',
    format: 'csv',
    example: 'RX-78-2 Gundam\t2\tMSG\t001',
  },
];
