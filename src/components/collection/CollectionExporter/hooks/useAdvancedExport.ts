'use client';
/**
 * Hook for advanced export (POST method with options)
 */

import { useCallback } from 'react';
import type { ExportRecord } from '@/lib/types';
import type { ExportFormat } from '../FormatSelectionGrid';
import type { ExportOptions } from '../types';

interface UseAdvancedExportOptions {
  selectedFormat: ExportFormat;
  exportOptions: ExportOptions;
  setIsExporting: (isExporting: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (record: ExportRecord) => void;
  onExportComplete?: (result: unknown) => void;
}

export function useAdvancedExport({
  selectedFormat,
  exportOptions,
  setIsExporting,
  setError,
  addToHistory,
  onExportComplete,
}: UseAdvancedExportOptions) {
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
      const exportRecord: ExportRecord = {
        id: Date.now().toString(),
        format: selectedFormat.name,
        date: new Date().toISOString(),
        options: { ...exportOptions },
        filename: result.filename,
        size: result.size,
        recordCount: result.recordCount,
      };

      addToHistory(exportRecord);

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
  }, [
    selectedFormat,
    exportOptions,
    setIsExporting,
    setError,
    addToHistory,
    onExportComplete,
  ]);

  return { handleAdvancedExport };
}
