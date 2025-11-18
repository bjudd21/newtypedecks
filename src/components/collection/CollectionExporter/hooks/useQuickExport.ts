'use client';
/**
 * Hook for quick export (GET method with direct download)
 */

import { useCallback } from 'react';
import type { ExportRecord } from '@/lib/types';
import type { ExportFormat } from '../FormatSelectionGrid';
import type { ExportOptions } from '../types';
import {
  generateExportFilename,
  generateExportParams,
  createQuickExportResult,
} from '../utils';

interface UseQuickExportOptions {
  selectedFormat: ExportFormat;
  exportOptions: ExportOptions;
  setIsExporting: (isExporting: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (record: ExportRecord) => void;
  onExportComplete?: (result: unknown) => void;
}

export function useQuickExport({
  selectedFormat,
  exportOptions,
  setIsExporting,
  setError,
  addToHistory,
  onExportComplete,
}: UseQuickExportOptions) {
  const handleQuickExport = useCallback(async () => {
    try {
      setIsExporting(true);
      setError(null);

      const params = generateExportParams(selectedFormat, exportOptions);
      const filename = generateExportFilename(selectedFormat);

      // Create download link
      const downloadUrl = `/api/collections/export?${params.toString()}`;

      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Add to export history
      const exportRecord: ExportRecord = {
        id: Date.now().toString(),
        format: selectedFormat.name,
        date: new Date().toISOString(),
        options: { ...exportOptions },
        filename,
      };

      addToHistory(exportRecord);

      if (onExportComplete) {
        onExportComplete(createQuickExportResult(selectedFormat, filename));
      }
    } catch (err) {
      console.error('Export error:', err);
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

  return { handleQuickExport };
}
