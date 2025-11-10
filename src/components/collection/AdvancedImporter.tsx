'use client';

import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Select,
  Badge,
} from '@/components/ui';
import type { PreviewCard } from '@/lib/types';

interface ImportSource {
  id: string;
  name: string;
  description: string;
  icon: string;
  format: string;
  example?: string;
}

interface ValidationError {
  line: number;
  error: string;
  suggestion?: string;
}

interface AdvancedImporterProps {
  onImportComplete?: (result: unknown) => void;
  className?: string;
}

const IMPORT_SOURCES: ImportSource[] = [
  {
    id: 'manual_csv',
    name: 'CSV File',
    description: 'Comma-separated values with card data',
    icon: '📊',
    format: 'csv',
    example: 'Card Name,Quantity,Set,Number\nRX-78-2 Gundam,2,MSG,001',
  },
  {
    id: 'deck_export',
    name: 'Deck Export',
    description: 'Export from other deck building tools',
    icon: '🎯',
    format: 'decklist',
    example: "2 RX-78-2 Gundam\n1 Char's Zaku II\n3x Nu Gundam",
  },
  {
    id: 'collection_backup',
    name: 'Collection Backup',
    description: 'JSON backup from this or other applications',
    icon: '💾',
    format: 'json',
    example: '[{"name":"RX-78-2 Gundam","quantity":2,"set":"MSG"}]',
  },
  {
    id: 'inventory_list',
    name: 'Inventory List',
    description: 'Simple text list with quantities',
    icon: '📝',
    format: 'decklist',
    example: "2x RX-78-2 Gundam\n1x Char's Zaku II",
  },
  {
    id: 'spreadsheet',
    name: 'Spreadsheet Export',
    description: 'Tab-separated values from Excel/Sheets',
    icon: '📋',
    format: 'csv',
    example: 'RX-78-2 Gundam\t2\tMSG\t001',
  },
];

export const AdvancedImporter: React.FC<AdvancedImporterProps> = ({
  onImportComplete,
  className,
}) => {
  const [selectedSource, setSelectedSource] = useState<ImportSource>(
    IMPORT_SOURCES[0]
  );
  const [importData, setImportData] = useState<string>('');
  const [importOptions, setImportOptions] = useState({
    updateBehavior: 'add',
    validateOnly: false,
    batchSize: 100,
    skipDuplicates: true,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [previewData, setPreviewData] = useState<PreviewCard[]>([]);
  const [currentStep, setCurrentStep] = useState<
    'select' | 'data' | 'validate' | 'options' | 'import'
  >('select');

  // Handle source selection
  const handleSourceSelect = useCallback((source: ImportSource) => {
    setSelectedSource(source);
    setImportData('');
    setValidationErrors([]);
    setPreviewData([]);
    setCurrentStep('data');
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsProcessing(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData(content);
        validateAndPreview(content);
        setIsProcessing(false);
      };

      reader.onerror = () => {
        setValidationErrors([{ line: 0, error: 'Failed to read file' }]);
        setIsProcessing(false);
      };

      reader.readAsText(file);
    },
    []
  );

  // Validate and generate preview
  const validateAndPreview = useCallback(
    (data: string) => {
      const errors: ValidationError[] = [];
      const preview: PreviewCard[] = [];

      if (!data.trim()) {
        setValidationErrors([]);
        setPreviewData([]);
        return;
      }

      try {
        switch (selectedSource.format) {
          case 'csv': {
            const lines = data.trim().split('\n');
            let startIndex = 0;

            // Detect header
            const firstLine = lines[0]?.toLowerCase();
            if (
              firstLine &&
              (firstLine.includes('name') ||
                firstLine.includes('card') ||
                firstLine.includes('quantity'))
            ) {
              startIndex = 1;
            }

            for (
              let i = startIndex;
              i < Math.min(lines.length, startIndex + 10);
              i++
            ) {
              const line = lines[i].trim();
              if (!line) continue;

              const parts = line.includes('\t')
                ? line.split('\t')
                : line.split(',');

              if (parts.length < 2) {
                errors.push({
                  line: i + 1,
                  error: 'Insufficient columns',
                  suggestion:
                    'Each line should have at least card name and quantity',
                });
                continue;
              }

              const cardName = parts[0]?.trim().replace(/^["']|["']$/g, '');
              const quantity = parseInt(parts[1]?.trim()) || 0;

              if (!cardName) {
                errors.push({ line: i + 1, error: 'Missing card name' });
                continue;
              }

              if (quantity <= 0) {
                errors.push({
                  line: i + 1,
                  error: 'Invalid quantity',
                  suggestion: 'Quantity must be a positive number',
                });
                continue;
              }

              preview.push({
                line: i + 1,
                cardName,
                quantity,
                setName: parts[2]?.trim().replace(/^["']|["']$/g, ''),
                setNumber: parts[3]?.trim().replace(/^["']|["']$/g, ''),
              });
            }
            break;
          }

          case 'json': {
            const jsonData = JSON.parse(data);
            if (!Array.isArray(jsonData)) {
              errors.push({
                line: 1,
                error: 'Data must be an array of card objects',
              });
              break;
            }

            for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
              const item = jsonData[i];
              const cardName = item.cardName || item.name;
              const quantity =
                parseInt(item.quantity) || parseInt(item.count) || 0;

              if (!cardName) {
                errors.push({
                  line: i + 1,
                  error: 'Missing card name in object',
                });
                continue;
              }

              if (quantity <= 0) {
                errors.push({
                  line: i + 1,
                  error: 'Invalid quantity in object',
                });
                continue;
              }

              preview.push({
                line: i + 1,
                cardName,
                quantity,
                setName: item.setName || item.set,
                cardId: item.cardId || item.id,
              });
            }
            break;
          }

          case 'decklist': {
            const lines = data.trim().split('\n');

            for (let i = 0; i < Math.min(lines.length, 10); i++) {
              const line = lines[i].trim();
              if (!line || line.startsWith('//') || line.startsWith('#'))
                continue;

              const match = line.match(/^(\d+)x?\s+(.+)$/);
              if (!match) {
                errors.push({
                  line: i + 1,
                  error: 'Invalid format',
                  suggestion: 'Use format like "3 Card Name" or "2x Card Name"',
                });
                continue;
              }

              const quantity = parseInt(match[1]);
              const cardName = match[2].trim();

              if (quantity <= 0) {
                errors.push({ line: i + 1, error: 'Invalid quantity' });
                continue;
              }

              if (!cardName) {
                errors.push({ line: i + 1, error: 'Missing card name' });
                continue;
              }

              preview.push({
                line: i + 1,
                cardName,
                quantity,
              });
            }
            break;
          }
        }
      } catch (error) {
        errors.push({
          line: 1,
          error: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }

      setValidationErrors(errors);
      setPreviewData(preview);

      // Auto-advance if validation passes
      if (errors.length === 0 && preview.length > 0) {
        setCurrentStep('validate');
      }
    },
    [selectedSource.format]
  );

  // Handle data change
  const handleDataChange = useCallback(
    (data: string) => {
      setImportData(data);
      validateAndPreview(data);
    },
    [validateAndPreview]
  );

  // Handle import
  const handleImport = useCallback(async () => {
    if (validationErrors.length > 0) {
      console.warn('Please fix validation errors before importing');
      return;
    }

    try {
      setIsProcessing(true);
      setCurrentStep('import');

      const response = await fetch('/api/collections/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: selectedSource.format,
          data:
            selectedSource.format === 'json'
              ? JSON.parse(importData)
              : importData,
          options: importOptions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Import failed');
      }

      const result = await response.json();

      if (onImportComplete) {
        onImportComplete(result);
      }

      // Reset form
      setImportData('');
      setPreviewData([]);
      setValidationErrors([]);
      setCurrentStep('select');
    } catch (error) {
      console.error('Import error:', error);
      console.warn(
        `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsProcessing(false);
    }
  }, [
    importData,
    selectedSource.format,
    importOptions,
    validationErrors.length,
    onImportComplete,
  ]);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Advanced Collection Import</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              {['select', 'data', 'validate', 'options', 'import'].map(
                (step, index) => (
                  <div
                    key={step}
                    className={`flex items-center ${index > 0 ? 'ml-2' : ''}`}
                  >
                    {index > 0 && <span className="mx-1 text-gray-300">→</span>}
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                        step === currentStep
                          ? 'bg-blue-500 text-white'
                          : ['select', 'data', 'validate'].indexOf(
                                currentStep
                              ) > ['select', 'data', 'validate'].indexOf(step)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Step 1: Source Selection */}
          {currentStep === 'select' && (
            <div className="space-y-4">
              <div className="mb-3 text-sm font-medium text-gray-700">
                Choose your import source:
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {IMPORT_SOURCES.map((source) => (
                  <div
                    key={source.id}
                    onClick={() => handleSourceSelect(source)}
                    className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-2xl">{source.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {source.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {source.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Data Input */}
          {currentStep === 'data' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">
                  Import from: {selectedSource.icon} {selectedSource.name}
                </div>
                <Button
                  onClick={() => setCurrentStep('select')}
                  variant="outline"
                  size="sm"
                >
                  Change Source
                </Button>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Upload File
                </label>
                <input
                  type="file"
                  accept=".csv,.tsv,.txt,.json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="text-center text-sm text-gray-500">or</div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Paste Data
                </label>
                <textarea
                  value={importData}
                  onChange={(e) => handleDataChange(e.target.value)}
                  placeholder={`Example format:\n${selectedSource.example}`}
                  className="h-32 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isProcessing}
                />
              </div>

              {isProcessing && (
                <div className="py-4 text-center">
                  <div className="text-gray-600">Processing...</div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Validation & Preview */}
          {currentStep === 'validate' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">
                  Validation & Preview
                </div>
                <Button
                  onClick={() => setCurrentStep('data')}
                  variant="outline"
                  size="sm"
                >
                  Edit Data
                </Button>
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="rounded border border-red-200 bg-red-50 p-3">
                  <div className="mb-2 font-medium text-red-800">
                    Validation Errors ({validationErrors.length})
                  </div>
                  <div className="max-h-32 space-y-1 overflow-y-auto">
                    {validationErrors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700">
                        <strong>Line {error.line}:</strong> {error.error}
                        {error.suggestion && (
                          <div className="ml-4 text-xs text-red-600">
                            💡 {error.suggestion}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              {previewData.length > 0 && (
                <div className="rounded border border-green-200 bg-green-50 p-3">
                  <div className="mb-2 font-medium text-green-800">
                    Preview (first 10 items)
                  </div>
                  <div className="max-h-32 space-y-1 overflow-y-auto">
                    {previewData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-sm"
                      >
                        <Badge variant="secondary" className="text-xs">
                          {item.quantity}x
                        </Badge>
                        <span className="flex-1">{item.cardName}</span>
                        {item.setName && (
                          <span className="text-xs text-gray-500">
                            ({item.setName})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-green-600">
                    ✅ Ready to import {previewData.length}+ cards
                  </div>
                </div>
              )}

              {validationErrors.length === 0 && previewData.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentStep('options')}
                    variant="default"
                  >
                    Continue to Options
                  </Button>
                  <Button onClick={handleImport} variant="outline">
                    Import Now
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Import Options */}
          {currentStep === 'options' && (
            <div className="space-y-4">
              <div className="text-sm font-medium text-gray-700">
                Import Options
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Update Behavior
                  </label>
                  <Select
                    value={importOptions.updateBehavior}
                    onChange={(value: string) =>
                      setImportOptions((prev) => ({
                        ...prev,
                        updateBehavior: value,
                      }))
                    }
                    options={[
                      { value: 'add', label: 'Add to existing quantities' },
                      {
                        value: 'replace',
                        label: 'Replace existing quantities',
                      },
                      { value: 'skip', label: 'Skip existing cards' },
                    ]}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Batch Size
                  </label>
                  <Select
                    value={importOptions.batchSize.toString()}
                    onChange={(value: string) =>
                      setImportOptions((prev) => ({
                        ...prev,
                        batchSize: parseInt(value),
                      }))
                    }
                    options={[
                      { value: '50', label: '50 cards per batch' },
                      { value: '100', label: '100 cards per batch' },
                      { value: '250', label: '250 cards per batch' },
                    ]}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="skipDuplicates"
                  checked={importOptions.skipDuplicates}
                  onChange={(e) =>
                    setImportOptions((prev) => ({
                      ...prev,
                      skipDuplicates: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="skipDuplicates"
                  className="text-sm text-gray-700"
                >
                  Skip duplicate entries in import data
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleImport}
                  variant="default"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Importing...' : 'Start Import'}
                </Button>
                <Button
                  onClick={() => setCurrentStep('validate')}
                  variant="outline"
                >
                  Back to Preview
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Import Progress */}
          {currentStep === 'import' && (
            <div className="py-8 text-center">
              <div className="mb-2 text-lg font-medium text-gray-900">
                Importing Collection...
              </div>
              <div className="text-sm text-gray-600">
                Please wait while we process your cards
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedImporter;
