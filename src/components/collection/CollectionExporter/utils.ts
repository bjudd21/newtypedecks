/**
 * Utility functions for CollectionExporter
 */

import type { ExportFormat } from './FormatSelectionGrid';
import type { ExportOptions, ExportResult } from './types';

/**
 * Generate filename for export
 */
export function generateExportFilename(
  format: ExportFormat,
  date: Date = new Date()
): string {
  const dateStr = date.toISOString().split('T')[0];
  return `gundam-collection-${format.id}-${dateStr}.${format.fileExtension}`;
}

/**
 * Generate URL parameters for quick export
 */
export function generateExportParams(
  format: ExportFormat,
  options: ExportOptions
): URLSearchParams {
  const params = new URLSearchParams({
    format: format.id,
    includeMetadata: options.includeMetadata.toString(),
    includeConditions: options.includeConditions.toString(),
    includeValues: options.includeValues.toString(),
  });

  if (options.onlyOwned) {
    params.append('filterBy', 'owned');
  }

  return params;
}

/**
 * Create export result object for quick export
 */
export function createQuickExportResult(
  format: ExportFormat,
  filename: string
): ExportResult {
  return {
    success: true,
    format: format.id,
    filename,
  };
}
