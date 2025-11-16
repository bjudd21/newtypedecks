/**
 * Hook for managing CollectionExporter state
 */

import { useState, useCallback } from 'react';
import type { ExportRecord } from '@/lib/types';
import type { ExportFormat } from '../FormatSelectionGrid';
import type { ExportOptions } from '../types';
import { EXPORT_FORMATS } from '../constants';

export function useExportState() {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(
    EXPORT_FORMATS[0]
  );
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
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

  // Add to export history
  const addToHistory = useCallback((record: ExportRecord) => {
    setExportHistory((prev) => [record, ...prev.slice(0, 4)]); // Keep last 5
  }, []);

  return {
    selectedFormat,
    setSelectedFormat,
    exportOptions,
    setExportOptions,
    isExporting,
    setIsExporting,
    error,
    setError,
    exportHistory,
    setExportHistory,
    handleFormatSelect,
    handleOptionChange,
    addToHistory,
  };
}
