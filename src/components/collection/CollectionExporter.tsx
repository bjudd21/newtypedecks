/**
 * CollectionExporter - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./CollectionExporter/ directory.
 */

export { CollectionExporterComponent as CollectionExporter } from './CollectionExporter/CollectionExporterComponent';
export { CollectionExporterComponent as default } from './CollectionExporter/CollectionExporterComponent';

// Re-export types
export type {
  CollectionExporterProps,
  ExportOptions,
  ExportResult,
} from './CollectionExporter/types';

// Re-export constants
export { EXPORT_FORMATS } from './CollectionExporter/constants';

// Re-export hooks
export { useExportState } from './CollectionExporter/hooks/useExportState';
export { useQuickExport } from './CollectionExporter/hooks/useQuickExport';
export { useAdvancedExport } from './CollectionExporter/hooks/useAdvancedExport';

// Re-export components
export { ErrorDisplay } from './CollectionExporter/components/ErrorDisplay';
export { ExportActions } from './CollectionExporter/components/ExportActions';

// Re-export utils
export {
  generateExportFilename,
  generateExportParams,
  createQuickExportResult,
} from './CollectionExporter/utils';
