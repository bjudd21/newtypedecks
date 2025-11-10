'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Select } from '@/components/ui';

interface ImportResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
  imported: Array<{
    cardName: string;
    quantity: number;
    action: 'added' | 'updated';
  }>;
}

interface CollectionImporterProps {
  onImportComplete?: (result: ImportResult) => void;
  className?: string;
}

export const CollectionImporter: React.FC<CollectionImporterProps> = ({
  onImportComplete,
  className
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [importData, setImportData] = useState<string>('');
  const [updateBehavior, setUpdateBehavior] = useState<string>('add');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewCards, setPreviewCards] = useState<any[]>([]);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);

      // Auto-detect format based on file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'csv' || extension === 'tsv') {
        setSelectedFormat('csv');
      } else if (extension === 'json') {
        setSelectedFormat('json');
      } else if (extension === 'txt') {
        setSelectedFormat('decklist');
      }

      // Generate preview
      generatePreview(content, selectedFormat);
    };
    reader.readAsText(file);
  }, [selectedFormat]);

  // Generate preview of import data
  const generatePreview = useCallback((data: string, format: string) => {
    try {
      let preview: any[] = [];

      switch (format) {
        case 'csv':
          const lines = data.trim().split('\n');
          const startIndex = lines[0]?.toLowerCase().includes('name') ? 1 : 0;

          preview = lines.slice(startIndex, Math.min(startIndex + 5, lines.length))
            .filter(line => line.trim())
            .map(line => {
              const parts = line.includes('\t') ? line.split('\t') : line.split(',');
              return {
                cardName: parts[0]?.trim().replace(/^["']|["']$/g, ''),
                quantity: parseInt(parts[1]?.trim()) || 0,
                setName: parts[2]?.trim().replace(/^["']|["']$/g, ''),
                setNumber: parts[3]?.trim().replace(/^["']|["']$/g, '')
              };
            });
          break;

        case 'json':
          const jsonData = JSON.parse(data);
          if (Array.isArray(jsonData)) {
            preview = jsonData.slice(0, 5).map(item => ({
              cardName: item.cardName || item.name,
              quantity: parseInt(item.quantity) || parseInt(item.count) || 1,
              setName: item.setName || item.set,
              cardId: item.cardId || item.id
            }));
          }
          break;

        case 'decklist':
        case 'mtga':
          const deckLines = data.trim().split('\n');
          preview = deckLines.slice(0, 5)
            .filter(line => line.trim() && !line.startsWith('//') && !line.startsWith('#'))
            .map(line => {
              const match = line.match(/^(\d+)x?\s+(.+)$/);
              if (match) {
                return {
                  cardName: match[2].trim(),
                  quantity: parseInt(match[1])
                };
              }
              return null;
            })
            .filter(Boolean);
          break;
      }

      setPreviewCards(preview.filter(card => card?.cardName && card?.quantity > 0));
    } catch (error) {
      console.error('Preview generation failed:', error);
      setPreviewCards([]);
    }
  }, []);

  // Handle format change
  const handleFormatChange = useCallback((format: string) => {
    setSelectedFormat(format);
    if (importData) {
      generatePreview(importData, format);
    }
  }, [importData, generatePreview]);

  // Handle text input change
  const handleDataChange = useCallback((data: string) => {
    setImportData(data);
    generatePreview(data, selectedFormat);
  }, [selectedFormat, generatePreview]);

  // Handle import
  const handleImport = useCallback(async () => {
    if (!importData.trim()) {
      setError('Please provide import data');
      return;
    }

    try {
      setIsImporting(true);
      setError(null);

      const response = await fetch('/api/collections/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: selectedFormat,
          data: selectedFormat === 'json' ? JSON.parse(importData) : importData,
          options: {
            updateBehavior
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Import failed');
      }

      const result = await response.json();
      setImportResult(result.result);

      if (onImportComplete) {
        onImportComplete(result.result);
      }

      // Clear data after successful import
      setImportData('');
      setPreviewCards([]);
    } catch (err) {
      console.error('Import error:', err);
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setIsImporting(false);
    }
  }, [importData, selectedFormat, updateBehavior, onImportComplete]);

  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'csv':
        return 'CSV/TSV format with columns: Card Name, Quantity, Set Name (optional), Set Number (optional)';
      case 'json':
        return 'JSON array with objects containing cardName/name, quantity/count, and optional setName/set';
      case 'decklist':
        return 'Simple deck list format: "3 Lightning Bolt" or "1x Storm Crow" (one per line)';
      case 'mtga':
        return 'MTG Arena export format: "3 Lightning Bolt (M21) 168"';
      default:
        return '';
    }
  };

  const getFormatExample = (format: string) => {
    switch (format) {
      case 'csv':
        return 'RX-78-2 Gundam,2,Mobile Suit Gundam,MSG-001\nChar\'s Zaku II,1,Mobile Suit Gundam,MSG-002';
      case 'json':
        return '[{"cardName":"RX-78-2 Gundam","quantity":2,"setName":"Mobile Suit Gundam"},{"cardName":"Char\'s Zaku II","quantity":1}]';
      case 'decklist':
        return '2 RX-78-2 Gundam\n1 Char\'s Zaku II\n3x Nu Gundam';
      case 'mtga':
        return '2 RX-78-2 Gundam (MSG) 001\n1 Char\'s Zaku II (MSG) 002';
      default:
        return '';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Import Collection</CardTitle>
          <div className="text-sm text-gray-600">
            Bulk import cards to your collection from various formats
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Import Format
              </label>
              <Select
                value={selectedFormat}
                onChange={handleFormatChange}
                options={[
                  { value: 'csv', label: 'CSV/TSV File' },
                  { value: 'json', label: 'JSON Format' },
                  { value: 'decklist', label: 'Deck List' },
                  { value: 'mtga', label: 'MTG Arena Format' }
                ]}
              />
              <div className="text-xs text-gray-500 mt-1">
                {getFormatDescription(selectedFormat)}
              </div>
            </div>

            {/* Update Behavior */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Behavior
              </label>
              <Select
                value={updateBehavior}
                onChange={setUpdateBehavior}
                options={[
                  { value: 'add', label: 'Add to existing quantities' },
                  { value: 'replace', label: 'Replace existing quantities' },
                  { value: 'skip', label: 'Skip cards already in collection' }
                ]}
              />
              <div className="text-xs text-gray-500 mt-1">
                How to handle cards that are already in your collection
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File
              </label>
              <input
                type="file"
                accept=".csv,.tsv,.txt,.json"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Manual Data Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Paste Data Manually
              </label>
              <textarea
                value={importData}
                onChange={(e) => handleDataChange(e.target.value)}
                placeholder={`Example ${selectedFormat} format:\n${getFormatExample(selectedFormat)}`}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>

            {/* Preview */}
            {previewCards.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Preview (first 5 cards)
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  {previewCards.map((card, index) => (
                    <div key={index} className="flex items-center gap-4 text-sm py-1">
                      <span className="w-8 text-center font-mono">{card.quantity}x</span>
                      <span className="flex-1">{card.cardName}</span>
                      {card.setName && (
                        <span className="text-gray-500 text-xs">({card.setName})</span>
                      )}
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 mt-2">
                    Ready to import {previewCards.length} card types
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            {/* Import Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleImport}
                disabled={!importData.trim() || isImporting}
                variant="default"
                className="flex-1"
              >
                {isImporting ? 'Importing...' : 'Import to Collection'}
              </Button>

              <Button
                onClick={() => {
                  setImportData('');
                  setPreviewCards([]);
                  setImportResult(null);
                  setError(null);
                }}
                variant="outline"
                disabled={isImporting}
              >
                Clear
              </Button>
            </div>

            {/* Import Result */}
            {importResult && (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <div className="font-medium text-green-800 mb-2">Import Complete!</div>
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{importResult.success}</div>
                    <div className="text-gray-600">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">{importResult.skipped}</div>
                    <div className="text-gray-600">Skipped</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{importResult.failed}</div>
                    <div className="text-gray-600">Failed</div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <details className="mt-3">
                    <summary className="text-sm font-medium text-red-700 cursor-pointer">
                      View Errors ({importResult.errors.length})
                    </summary>
                    <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded max-h-32 overflow-y-auto">
                      {importResult.errors.map((error, index) => (
                        <div key={index}>• {error}</div>
                      ))}
                    </div>
                  </details>
                )}

                {importResult.imported.length > 0 && (
                  <details className="mt-3">
                    <summary className="text-sm font-medium text-green-700 cursor-pointer">
                      View Imported Cards ({importResult.imported.length})
                    </summary>
                    <div className="mt-2 text-xs bg-green-50 p-2 rounded max-h-32 overflow-y-auto">
                      {importResult.imported.slice(0, 10).map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-6">{item.quantity}x</span>
                          <span className="flex-1">{item.cardName}</span>
                          <span className={`text-xs px-1 rounded ${
                            item.action === 'added' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {item.action}
                          </span>
                        </div>
                      ))}
                      {importResult.imported.length > 10 && (
                        <div className="text-gray-500 mt-1">
                          ... and {importResult.imported.length - 10} more
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            )}

            {/* Format Guidelines */}
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <div className="font-medium mb-2">Import Guidelines:</div>
              <ul className="space-y-1">
                <li>• Maximum 1000 cards per import</li>
                <li>• Cards are matched by name, set number, or card ID</li>
                <li>• Unmatched cards will be skipped with error details</li>
                <li>• CSV files should use commas or tabs as separators</li>
                <li>• JSON format should be an array of card objects</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectionImporter;