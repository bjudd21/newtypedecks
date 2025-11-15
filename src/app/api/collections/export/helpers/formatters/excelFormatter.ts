/**
 * Excel Export Formatter
 *
 * Generates Excel-compatible exports (currently CSV format)
 * In a full implementation, would use a library like 'xlsx' or 'exceljs'
 */

import type {
  CollectionCardData,
  ExportOptions,
  ExportResult,
} from '../types';
import { generateCSVExport } from './csvFormatter';

/**
 * Generate Excel export (currently returns CSV format)
 * TODO: Implement true XLSX format with a library
 */
export function generateExcelExport(
  collectionCards: CollectionCardData[],
  options: ExportOptions
): ExportResult {
  // For now, return CSV format with Excel-friendly headers
  // In a full implementation, you'd use a library like 'xlsx' or 'exceljs'
  return generateCSVExport(collectionCards, options);
}
