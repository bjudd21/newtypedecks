/**
 * CollectionImporter - Main component for importing card collections
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import {
  ImportPreviewList,
  ImportResultDisplay,
  ImportGuidelinesInfo,
} from './';
import { useImportState } from './hooks/useImportState';
import { usePreviewGenerator } from './hooks/usePreviewGenerator';
import { useFileHandler } from './hooks/useFileHandler';
import { useImportHandlers } from './hooks/useImportHandlers';
import { useImportAction } from './hooks/useImportAction';
import { FormatSelector } from './components/FormatSelector';
import { UpdateBehaviorSelector } from './components/UpdateBehaviorSelector';
import { FileUploader } from './components/FileUploader';
import { ManualDataInput } from './components/ManualDataInput';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ImportActions } from './components/ImportActions';
import type { CollectionImporterProps } from './types';

export const CollectionImporterComponent: React.FC<CollectionImporterProps> = ({
  onImportComplete,
  className,
}) => {
  // State management
  const {
    selectedFormat,
    setSelectedFormat,
    importData,
    setImportData,
    updateBehavior,
    setUpdateBehavior,
    isImporting,
    setIsImporting,
    importResult,
    setImportResult,
    error,
    setError,
    previewCards,
    setPreviewCards,
    clearAll,
  } = useImportState();

  // Preview generation
  const { generatePreview } = usePreviewGenerator({
    setPreviewCards,
  });

  // File handling
  const { handleFileUpload } = useFileHandler({
    selectedFormat,
    setImportData,
    setSelectedFormat,
    generatePreview,
  });

  // Format and data change handlers
  const { handleFormatChange, handleDataChange } = useImportHandlers({
    importData,
    selectedFormat,
    setSelectedFormat,
    setImportData,
    generatePreview,
  });

  // Import action
  const { handleImport } = useImportAction({
    importData,
    selectedFormat,
    updateBehavior,
    setIsImporting,
    setError,
    setImportResult,
    setImportData,
    setPreviewCards,
    onImportComplete,
  });

  return (
    <div className={className}>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-primary/80">IMPORT COLLECTION</CardTitle>
          <div className="text-muted-foreground text-sm">
            Bulk import cards to your collection from various formats
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Format Selection */}
            <FormatSelector
              selectedFormat={selectedFormat}
              onFormatChange={handleFormatChange}
            />

            {/* Update Behavior */}
            <UpdateBehaviorSelector
              updateBehavior={updateBehavior}
              onUpdateBehaviorChange={setUpdateBehavior}
            />

            {/* File Upload */}
            <FileUploader onFileUpload={handleFileUpload} />

            {/* Manual Data Input */}
            <ManualDataInput
              selectedFormat={selectedFormat}
              importData={importData}
              onDataChange={handleDataChange}
            />

            {/* Preview */}
            <ImportPreviewList cards={previewCards} />

            {/* Error Display */}
            <ErrorDisplay error={error} />

            {/* Import Actions */}
            <ImportActions
              isImporting={isImporting}
              hasData={!!importData.trim()}
              onImport={handleImport}
              onClear={clearAll}
            />

            {/* Import Result */}
            {importResult && <ImportResultDisplay result={importResult} />}

            {/* Format Guidelines */}
            <ImportGuidelinesInfo />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectionImporterComponent;
