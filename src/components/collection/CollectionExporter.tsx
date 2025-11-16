'use client';

import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import type { ExportRecord } from '@/lib/types';
import {
  CollectionStatsCard,
  FormatSelectionGrid,
  ExportOptionsPanel,
  ExportHistoryList,
  ExportGuidelinesInfo,
  type ExportFormat,
} from './CollectionExporter/';

interface CollectionExporterProps {
  collectionStats?: {
    totalCards: number;
    uniqueCards: number;
    totalValue?: number;
  };
  onExportComplete?: (result: unknown) => void;
  className?: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
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

export const CollectionExporter: React.FC<CollectionExporterProps> = ({
  collectionStats,
  onExportComplete,
  className,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(
    EXPORT_FORMATS[0]
  );
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    includeConditions: true,
    includeValues: false,
    onlyOwned: true,
    customName: '',
  });
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useState<ExportRecord[]>([]);

  // Handle format selection
  const handleFormatSelect = useCallback((format: ExportFormat) => {
    setSelectedFormat(format);
    setError(null);
  }, []);

  // Handle option change
  const handleOptionChange = useCallback((option: string, value: unknown) => {
    setExportOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  }, []);

  // Handle export via GET (direct download)
  const handleQuickExport = useCallback(async () => {
    try {
      setIsExporting(true);
      setError(null);

      const params = new URLSearchParams({
        format: selectedFormat.id,
        includeMetadata: exportOptions.includeMetadata.toString(),
        includeConditions: exportOptions.includeConditions.toString(),
        includeValues: exportOptions.includeValues.toString(),
      });

      if (exportOptions.onlyOwned) {
        params.append('filterBy', 'owned');
      }

      // Create download link
      const downloadUrl = `/api/collections/export?${params.toString()}`;

      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `gundam-collection-${selectedFormat.id}-${new Date().toISOString().split('T')[0]}.${selectedFormat.fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Add to export history
      const exportRecord = {
        id: Date.now().toString(),
        format: selectedFormat.name,
        date: new Date().toISOString(),
        options: { ...exportOptions },
        filename: `gundam-collection-${selectedFormat.id}-${new Date().toISOString().split('T')[0]}.${selectedFormat.fileExtension}`,
      };

      setExportHistory((prev) => [exportRecord, ...prev.slice(0, 4)]); // Keep last 5

      if (onExportComplete) {
        onExportComplete({
          success: true,
          format: selectedFormat.id,
          filename: exportRecord.filename,
        });
      }
    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  }, [selectedFormat, exportOptions, onExportComplete]);

  // Handle advanced export via POST
  const handleAdvancedExport = useCallback(async () => {
    try {
      setIsExporting(true);
      setError(null);

      const response = await fetch('/api/collections/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: selectedFormat.id,
          options: exportOptions,
          exportName: exportOptions.customName || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      const result = await response.json();

      // Add to export history
      const exportRecord = {
        id: Date.now().toString(),
        format: selectedFormat.name,
        date: new Date().toISOString(),
        options: { ...exportOptions },
        filename: result.filename,
        size: result.size,
        recordCount: result.recordCount,
      };

      setExportHistory((prev) => [exportRecord, ...prev.slice(0, 4)]);

      if (onExportComplete) {
        onExportComplete(result);
      }

      console.warn(`Export completed! ${result.recordCount} records exported.`);
    } catch (err) {
      console.error('Advanced export error:', err);
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  }, [selectedFormat, exportOptions, onExportComplete]);

  return (
    <div className={className}>
      <Card className="border-[#443a5c] bg-[#2d2640]">
        <CardHeader>
          <CardTitle className="text-[#a89ec7]">EXPORT COLLECTION</CardTitle>
          <div className="text-sm text-gray-400">
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
            {error && (
              <div className="rounded border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Export Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleQuickExport}
                disabled={isExporting}
                className="flex-1 bg-gradient-to-r from-[#8b7aaa] to-[#6b5a8a] hover:from-[#a89ec7] hover:to-[#8b7aaa]"
              >
                {isExporting
                  ? 'EXPORTING...'
                  : `EXPORT AS ${selectedFormat.name.toUpperCase()}`}
              </Button>

              {selectedFormat.supportsOptions && (
                <Button
                  onClick={handleAdvancedExport}
                  disabled={isExporting}
                  variant="outline"
                  className="border-[#8b7aaa] text-[#8b7aaa] hover:bg-[#8b7aaa] hover:text-white"
                >
                  ADVANCED EXPORT
                </Button>
              )}
            </div>

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

export default CollectionExporter;
