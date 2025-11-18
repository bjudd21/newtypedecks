'use client';
/**
 * Hook for handling import actions
 */

import { useCallback } from 'react';
import type { PreviewCard } from '@/lib/types';
import type { ImportFormat, UpdateBehavior } from '../types';
import type { ImportResult } from '../';

interface UseImportActionOptions {
  importData: string;
  selectedFormat: ImportFormat;
  updateBehavior: UpdateBehavior;
  setIsImporting: (isImporting: boolean) => void;
  setError: (error: string | null) => void;
  setImportResult: (result: ImportResult | null) => void;
  setImportData: (data: string) => void;
  setPreviewCards: (cards: PreviewCard[]) => void;
  onImportComplete?: (result: ImportResult) => void;
}

export function useImportAction({
  importData,
  selectedFormat,
  updateBehavior,
  setIsImporting,
  setError,
  setImportResult,
  setImportData,
  setPreviewCards,
  onImportComplete,
}: UseImportActionOptions) {
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
  }, [
    importData,
    selectedFormat,
    updateBehavior,
    setIsImporting,
    setError,
    setImportResult,
    setImportData,
    setPreviewCards,
    onImportComplete,
  ]);

  return { handleImport };
}
