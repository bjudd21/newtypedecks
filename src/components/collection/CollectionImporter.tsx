'use client';

import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Select,
} from '@/components/ui';
import type { PreviewCard } from '@/lib/types';
import {
  ImportPreviewList,
  ImportResultDisplay,
  ImportGuidelinesInfo,
  getFormatDescription,
  getFormatExample,
  type ImportResult,
} from './CollectionImporter/';

interface CollectionImporterProps {
  onImportComplete?: (result: ImportResult) => void;
  className?: string;
}

export const CollectionImporter: React.FC<CollectionImporterProps> = ({
  onImportComplete,
  className,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [importData, setImportData] = useState<string>('');
  const [updateBehavior, setUpdateBehavior] = useState<string>('add');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewCards, setPreviewCards] = useState<PreviewCard[]>([]);

  // Handle file upload
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [selectedFormat]
  );

  // Generate preview of import data
  const generatePreview = useCallback((data: string, format: string) => {
    try {
      let preview: unknown[] = [];

      switch (format) {
        case 'csv':
          const lines = data.trim().split('\n');
          const startIndex = lines[0]?.toLowerCase().includes('name') ? 1 : 0;

          preview = lines
            .slice(startIndex, Math.min(startIndex + 5, lines.length))
            .filter((line) => line.trim())
            .map((line) => {
              const parts = line.includes('\t')
                ? line.split('\t')
                : line.split(',');
              return {
                cardName: parts[0]?.trim().replace(/^["']|["']$/g, ''),
                quantity: parseInt(parts[1]?.trim()) || 0,
                setName: parts[2]?.trim().replace(/^["']|["']$/g, ''),
                setNumber: parts[3]?.trim().replace(/^["']|["']$/g, ''),
              };
            });
          break;

        case 'json':
          const jsonData = JSON.parse(data);
          if (Array.isArray(jsonData)) {
            preview = jsonData.slice(0, 5).map((item) => ({
              cardName: item.cardName || item.name,
              quantity: parseInt(item.quantity) || parseInt(item.count) || 1,
              setName: item.setName || item.set,
              cardId: item.cardId || item.id,
            }));
          }
          break;

        case 'decklist':
        case 'mtga':
          const deckLines = data.trim().split('\n');
          preview = deckLines
            .slice(0, 5)
            .filter(
              (line) =>
                line.trim() && !line.startsWith('//') && !line.startsWith('#')
            )
            .map((line) => {
              const match = line.match(/^(\d+)x?\s+(.+)$/);
              if (match) {
                return {
                  cardName: match[2].trim(),
                  quantity: parseInt(match[1]),
                };
              }
              return null;
            })
            .filter(Boolean);
          break;
      }

      setPreviewCards(
        preview.filter((card): card is { cardName: string; quantity: number } =>
          Boolean(
            card &&
              typeof card === 'object' &&
              'cardName' in card &&
              'quantity' in card &&
              card.cardName &&
              typeof card.quantity === 'number' &&
              card.quantity > 0
          )
        )
      );
    } catch (error) {
      console.error('Preview generation failed:', error);
      setPreviewCards([]);
    }
  }, []);

  // Handle format change
  const handleFormatChange = useCallback(
    (format: string) => {
      setSelectedFormat(format);
      if (importData) {
        generatePreview(importData, format);
      }
    },
    [importData, generatePreview]
  );

  // Handle text input change
  const handleDataChange = useCallback(
    (data: string) => {
      setImportData(data);
      generatePreview(data, selectedFormat);
    },
    [selectedFormat, generatePreview]
  );

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
            updateBehavior,
          },
        }),
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

  return (
    <div className={className}>
      <Card className="border-[#443a5c] bg-[#2d2640]">
        <CardHeader>
          <CardTitle className="text-[#a89ec7]">IMPORT COLLECTION</CardTitle>
          <div className="text-sm text-gray-400">
            Bulk import cards to your collection from various formats
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Import Format
              </label>
              <Select
                value={selectedFormat}
                onChange={handleFormatChange}
                options={[
                  { value: 'csv', label: 'CSV/TSV File' },
                  { value: 'json', label: 'JSON Format' },
                  { value: 'decklist', label: 'Deck List' },
                  { value: 'mtga', label: 'MTG Arena Format' },
                ]}
              />
              <div className="mt-1 text-xs text-gray-400">
                {getFormatDescription(selectedFormat)}
              </div>
            </div>

            {/* Update Behavior */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Update Behavior
              </label>
              <Select
                value={updateBehavior}
                onChange={setUpdateBehavior}
                options={[
                  { value: 'add', label: 'Add to existing quantities' },
                  { value: 'replace', label: 'Replace existing quantities' },
                  { value: 'skip', label: 'Skip cards already in collection' },
                ]}
              />
              <div className="mt-1 text-xs text-gray-400">
                How to handle cards that are already in your collection
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Upload File
              </label>
              <input
                type="file"
                accept=".csv,.tsv,.txt,.json"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-[#8b7aaa]/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#8b7aaa] hover:file:bg-[#8b7aaa]/30"
              />
            </div>

            {/* Manual Data Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Or Paste Data Manually
              </label>
              <textarea
                value={importData}
                onChange={(e) => handleDataChange(e.target.value)}
                placeholder={`Example ${selectedFormat} format:\n${getFormatExample(selectedFormat)}`}
                className="h-32 w-full rounded-md border border-[#443a5c] bg-[#1a1625] px-3 py-2 font-mono text-sm text-white placeholder-gray-500 shadow-sm focus:border-[#8b7aaa] focus:ring-1 focus:ring-[#8b7aaa] focus:outline-none"
              />
            </div>

            {/* Preview */}
            <ImportPreviewList cards={previewCards} />

            {/* Error Display */}
            {error && (
              <div className="rounded border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Import Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleImport}
                disabled={!importData.trim() || isImporting}
                className="flex-1 bg-gradient-to-r from-[#8b7aaa] to-[#6b5a8a] hover:from-[#a89ec7] hover:to-[#8b7aaa]"
              >
                {isImporting ? 'Importing...' : 'IMPORT TO COLLECTION'}
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
                className="border-[#8b7aaa] text-[#8b7aaa] hover:bg-[#8b7aaa] hover:text-white"
              >
                CLEAR
              </Button>
            </div>

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

export default CollectionImporter;
