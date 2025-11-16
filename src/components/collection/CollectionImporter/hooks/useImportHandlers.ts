/**
 * Hook for handling format and data changes
 */

import { useCallback } from 'react';
import type { ImportFormat } from '../types';

interface UseImportHandlersOptions {
  importData: string;
  selectedFormat: ImportFormat;
  setSelectedFormat: (format: ImportFormat) => void;
  setImportData: (data: string) => void;
  generatePreview: (data: string, format: ImportFormat) => void;
}

export function useImportHandlers({
  importData,
  selectedFormat,
  setSelectedFormat,
  setImportData,
  generatePreview,
}: UseImportHandlersOptions) {
  const handleFormatChange = useCallback(
    (format: ImportFormat) => {
      setSelectedFormat(format);
      if (importData) {
        generatePreview(importData, format);
      }
    },
    [importData, setSelectedFormat, generatePreview]
  );

  const handleDataChange = useCallback(
    (data: string) => {
      setImportData(data);
      generatePreview(data, selectedFormat);
    },
    [selectedFormat, setImportData, generatePreview]
  );

  return { handleFormatChange, handleDataChange };
}
