/**
 * CollectionImporter - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./CollectionImporter/ directory.
 */

export { CollectionImporterComponent as CollectionImporter } from './CollectionImporter/CollectionImporterComponent';
export { CollectionImporterComponent as default } from './CollectionImporter/CollectionImporterComponent';

// Re-export types
export type {
  CollectionImporterProps,
  ImportFormat,
  UpdateBehavior,
} from './CollectionImporter/types';

// Re-export hooks
export { useImportState } from './CollectionImporter/hooks/useImportState';
export { usePreviewGenerator } from './CollectionImporter/hooks/usePreviewGenerator';
export { useFileHandler } from './CollectionImporter/hooks/useFileHandler';
export { useImportHandlers } from './CollectionImporter/hooks/useImportHandlers';
export { useImportAction } from './CollectionImporter/hooks/useImportAction';

// Re-export components
export { FormatSelector } from './CollectionImporter/components/FormatSelector';
export { UpdateBehaviorSelector } from './CollectionImporter/components/UpdateBehaviorSelector';
export { FileUploader } from './CollectionImporter/components/FileUploader';
export { ManualDataInput } from './CollectionImporter/components/ManualDataInput';
export { ErrorDisplay } from './CollectionImporter/components/ErrorDisplay';
export { ImportActions } from './CollectionImporter/components/ImportActions';
