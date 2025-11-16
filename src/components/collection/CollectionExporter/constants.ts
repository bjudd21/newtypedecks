/**
 * Constants for CollectionExporter
 */

import type { ExportFormat } from './FormatSelectionGrid';

export const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'json',
    name: 'JSON Backup',
    description: 'Complete collection data with all metadata',
    icon: '💾',
    fileExtension: 'json',
    supportsOptions: true,
  },
  {
    id: 'csv',
    name: 'CSV Spreadsheet',
    description: 'Excel-compatible format for analysis',
    icon: '📊',
    fileExtension: 'csv',
    supportsOptions: true,
  },
  {
    id: 'txt',
    name: 'Text List',
    description: 'Simple human-readable list',
    icon: '📝',
    fileExtension: 'txt',
    supportsOptions: false,
  },
  {
    id: 'decklist',
    name: 'Deck List Format',
    description: 'Import into other deck builders',
    icon: '🎯',
    fileExtension: 'txt',
    supportsOptions: false,
  },
];
