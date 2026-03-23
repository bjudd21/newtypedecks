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
    example: 'Card Name,Quantity,Set,Number\nCard Alpha,2,BS,001',
  },
  {
    id: 'deck_export',
    name: 'Deck Export',
    description: 'Export from other deck building tools',
    icon: '🎯',
    format: 'decklist',
    example: '2 Card Alpha\n1 Card Beta\n3x Card Gamma',
  },
  {
    id: 'collection_backup',
    name: 'Collection Backup',
    description: 'JSON backup from this or other applications',
    icon: '💾',
    format: 'json',
    example: '[{"name":"Card Alpha","quantity":2,"set":"BS"}]',
  },
  {
    id: 'inventory_list',
    name: 'Inventory List',
    description: 'Simple text list with quantities',
    icon: '📝',
    format: 'decklist',
    example: '2x Card Alpha\n1x Card Beta',
  },
  {
    id: 'spreadsheet',
    name: 'Spreadsheet Export',
    description: 'Tab-separated values from Excel/Sheets',
    icon: '📋',
    format: 'csv',
    example: 'Card Alpha\t2\tBS\t001',
  },
];
