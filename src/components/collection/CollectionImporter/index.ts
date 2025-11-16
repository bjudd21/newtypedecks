/**
 * CollectionImporter module exports
 */

// Main component
export { CollectionImporterComponent } from './CollectionImporterComponent';
export { CollectionImporterComponent as default } from './CollectionImporterComponent';

// Types
export * from './types';

// Hooks
export { useImportState } from './hooks/useImportState';
export { usePreviewGenerator } from './hooks/usePreviewGenerator';
export { useFileHandler } from './hooks/useFileHandler';
export { useImportHandlers } from './hooks/useImportHandlers';
export { useImportAction } from './hooks/useImportAction';

// UI Components
export { FormatSelector } from './components/FormatSelector';
export { UpdateBehaviorSelector } from './components/UpdateBehaviorSelector';
export { FileUploader } from './components/FileUploader';
export { ManualDataInput } from './components/ManualDataInput';
export { ErrorDisplay } from './components/ErrorDisplay';
export { ImportActions } from './components/ImportActions';

// Existing sub-components
export { ImportPreviewList } from './ImportPreviewList';
export { ImportResultDisplay, type ImportResult } from './ImportResultDisplay';
export { ImportGuidelinesInfo } from './ImportGuidelinesInfo';
export { getFormatDescription, getFormatExample } from './formatHelpers';
