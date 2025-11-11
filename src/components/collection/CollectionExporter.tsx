'use client';

import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
} from '@/components/ui';
import type { ExportRecord } from '@/lib/types';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: string;
  fileExtension: string;
  supportsOptions?: boolean;
}

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
              <div className="rounded-lg border border-[#443a5c] bg-[#1a1625] p-4">
                <div className="mb-2 text-sm font-medium text-[#8b7aaa]">
                  Collection Summary
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                  <div>
                    <div className="font-semibold text-white">
                      {collectionStats.totalCards}
                    </div>
                    <div className="text-gray-400">Total Cards</div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {collectionStats.uniqueCards}
                    </div>
                    <div className="text-gray-400">Unique Cards</div>
                  </div>
                  {collectionStats.totalValue && (
                    <div>
                      <div className="font-semibold text-white">
                        ${collectionStats.totalValue.toFixed(2)}
                      </div>
                      <div className="text-gray-400">Total Value</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Format Selection */}
            <div>
              <div className="mb-3 text-sm font-medium text-gray-400">
                Choose Export Format:
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {EXPORT_FORMATS.map((format) => (
                  <div
                    key={format.id}
                    onClick={() => handleFormatSelect(format)}
                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                      selectedFormat.id === format.id
                        ? 'border-[#8b7aaa] bg-[#3a3050]'
                        : 'border-[#443a5c] hover:border-[#8b7aaa] hover:bg-[#1a1625]'
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-2xl">{format.icon}</span>
                      <div>
                        <div className="font-medium text-white">
                          {format.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {format.description}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      .{format.fileExtension}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Options */}
            {selectedFormat.supportsOptions && (
              <div>
                <div className="mb-3 text-sm font-medium text-gray-400">
                  Export Options:
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="onlyOwned"
                        checked={exportOptions.onlyOwned}
                        onChange={(e) =>
                          handleOptionChange('onlyOwned', e.target.checked)
                        }
                        className="rounded border-gray-300 text-[#8b7aaa] focus:ring-[#8b7aaa]"
                      />
                      <label
                        htmlFor="onlyOwned"
                        className="text-sm text-gray-400"
                      >
                        Only export owned cards (quantity &gt; 0)
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeMetadata"
                        checked={exportOptions.includeMetadata}
                        onChange={(e) =>
                          handleOptionChange(
                            'includeMetadata',
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-[#8b7aaa] focus:ring-[#8b7aaa]"
                      />
                      <label
                        htmlFor="includeMetadata"
                        className="text-sm text-gray-400"
                      >
                        Include metadata (dates, IDs)
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeConditions"
                        checked={exportOptions.includeConditions}
                        onChange={(e) =>
                          handleOptionChange(
                            'includeConditions',
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-[#8b7aaa] focus:ring-[#8b7aaa]"
                      />
                      <label
                        htmlFor="includeConditions"
                        className="text-sm text-gray-400"
                      >
                        Include card conditions
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeValues"
                        checked={exportOptions.includeValues}
                        onChange={(e) =>
                          handleOptionChange('includeValues', e.target.checked)
                        }
                        className="rounded border-gray-300 text-[#8b7aaa] focus:ring-[#8b7aaa]"
                      />
                      <label
                        htmlFor="includeValues"
                        className="text-sm text-gray-400"
                      >
                        Include market values
                      </label>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-400">
                        Custom Export Name (optional)
                      </label>
                      <Input
                        value={exportOptions.customName}
                        onChange={(e) =>
                          handleOptionChange('customName', e.target.value)
                        }
                        placeholder="e.g., tournament-collection"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
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
            {exportHistory.length > 0 && (
              <div>
                <div className="mb-2 text-sm font-medium text-gray-400">
                  Recent Exports
                </div>
                <div className="max-h-32 space-y-2 overflow-y-auto">
                  {exportHistory.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between rounded border border-[#443a5c] bg-[#1a1625] p-2 text-sm"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-white">{record.format}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(record.date).toLocaleDateString()} •{' '}
                          {record.filename}
                          {record.recordCount &&
                            ` • ${record.recordCount} cards`}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {record.format.toLowerCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Format Information */}
            <div className="rounded border border-[#443a5c] bg-[#1a1625] p-3 text-xs text-gray-400">
              <div className="mb-2 font-medium text-white">Export Guidelines:</div>
              <ul className="space-y-1">
                <li>
                  • <strong>JSON:</strong> Complete backup with all data - best
                  for re-importing
                </li>
                <li>
                  • <strong>CSV:</strong> Spreadsheet format - good for analysis
                  and editing
                </li>
                <li>
                  • <strong>Text:</strong> Human-readable list - easy to view
                  and print
                </li>
                <li>
                  • <strong>Deck List:</strong> Simple format - compatible with
                  other tools
                </li>
                <li>
                  • All exports include proper file names with date stamps
                </li>
                <li>
                  • Exports are generated in real-time from your current
                  collection
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectionExporter;
