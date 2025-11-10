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
  const [exportHistory, setExportHistory] = useState<any[]>([]);

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
      <Card>
        <CardHeader>
          <CardTitle>Export Collection</CardTitle>
          <div className="text-sm text-gray-600">
            Create backups and share your collection in various formats
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Collection Stats */}
            {collectionStats && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-2 text-sm font-medium text-blue-800">
                  Collection Summary
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                  <div>
                    <div className="font-semibold text-blue-900">
                      {collectionStats.totalCards}
                    </div>
                    <div className="text-blue-700">Total Cards</div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">
                      {collectionStats.uniqueCards}
                    </div>
                    <div className="text-blue-700">Unique Cards</div>
                  </div>
                  {collectionStats.totalValue && (
                    <div>
                      <div className="font-semibold text-blue-900">
                        ${collectionStats.totalValue.toFixed(2)}
                      </div>
                      <div className="text-blue-700">Total Value</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Format Selection */}
            <div>
              <div className="mb-3 text-sm font-medium text-gray-700">
                Choose Export Format:
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {EXPORT_FORMATS.map((format) => (
                  <div
                    key={format.id}
                    onClick={() => handleFormatSelect(format)}
                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                      selectedFormat.id === format.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-2xl">{format.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {format.name}
                        </div>
                        <div className="text-sm text-gray-600">
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
                <div className="mb-3 text-sm font-medium text-gray-700">
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
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="onlyOwned"
                        className="text-sm text-gray-700"
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
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="includeMetadata"
                        className="text-sm text-gray-700"
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
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="includeConditions"
                        className="text-sm text-gray-700"
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
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="includeValues"
                        className="text-sm text-gray-700"
                      >
                        Include market values
                      </label>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
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
              <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Export Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleQuickExport}
                disabled={isExporting}
                variant="default"
                className="flex-1"
              >
                {isExporting
                  ? 'Exporting...'
                  : `Export as ${selectedFormat.name}`}
              </Button>

              {selectedFormat.supportsOptions && (
                <Button
                  onClick={handleAdvancedExport}
                  disabled={isExporting}
                  variant="outline"
                >
                  Advanced Export
                </Button>
              )}
            </div>

            {/* Export History */}
            {exportHistory.length > 0 && (
              <div>
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Recent Exports
                </div>
                <div className="max-h-32 space-y-2 overflow-y-auto">
                  {exportHistory.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between rounded bg-gray-50 p-2 text-sm"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{record.format}</div>
                        <div className="text-xs text-gray-600">
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
            <div className="rounded bg-gray-50 p-3 text-xs text-gray-500">
              <div className="mb-2 font-medium">Export Guidelines:</div>
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
