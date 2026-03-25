/**
 * CollectionExporter - Main component for exporting collections
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import {
  CollectionStatsCard,
  FormatSelectionGrid,
  ExportOptionsPanel,
  ExportHistoryList,
  ExportGuidelinesInfo,
} from './';
import { useExportState } from './hooks/useExportState';
import { useQuickExport } from './hooks/useQuickExport';
import { useAdvancedExport } from './hooks/useAdvancedExport';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ExportActions } from './components/ExportActions';
import { EXPORT_FORMATS } from './constants';
import type { CollectionExporterProps } from './types';

export const CollectionExporterComponent: React.FC<CollectionExporterProps> = ({
  collectionStats,
  onExportComplete,
  className,
}) => {
  // State management
  const {
    selectedFormat,
    exportOptions,
    isExporting,
    error,
    exportHistory,
    setIsExporting,
    setError,
    handleFormatSelect,
    handleOptionChange,
    addToHistory,
  } = useExportState();

  // Quick export handler
  const { handleQuickExport } = useQuickExport({
    selectedFormat,
    exportOptions,
    setIsExporting,
    setError,
    addToHistory,
    onExportComplete,
  });

  // Advanced export handler
  const { handleAdvancedExport } = useAdvancedExport({
    selectedFormat,
    exportOptions,
    setIsExporting,
    setError,
    addToHistory,
    onExportComplete,
  });

  return (
    <div className={className}>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-primary/80">EXPORT COLLECTION</CardTitle>
          <div className="text-muted-foreground text-sm">
            Create backups and share your collection in various formats
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Collection Stats */}
            {collectionStats && (
              <CollectionStatsCard
                totalCards={collectionStats.totalCards}
                uniqueCards={collectionStats.uniqueCards}
                totalValue={collectionStats.totalValue}
              />
            )}

            {/* Format Selection */}
            <FormatSelectionGrid
              formats={EXPORT_FORMATS}
              selectedFormat={selectedFormat}
              onFormatSelect={handleFormatSelect}
            />

            {/* Export Options */}
            {selectedFormat.supportsOptions && (
              <ExportOptionsPanel
                options={exportOptions}
                onOptionChange={handleOptionChange}
              />
            )}

            {/* Error Display */}
            <ErrorDisplay error={error} />

            {/* Export Actions */}
            <ExportActions
              selectedFormat={selectedFormat}
              isExporting={isExporting}
              onQuickExport={handleQuickExport}
              onAdvancedExport={handleAdvancedExport}
            />

            {/* Export History */}
            <ExportHistoryList history={exportHistory} />

            {/* Format Information */}
            <ExportGuidelinesInfo />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectionExporterComponent;
