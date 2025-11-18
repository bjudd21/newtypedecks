'use client';
/**
 * Hook for handling file uploads
 */

import { useCallback } from 'react';
import type { ImportFormat } from '../types';

interface UseFileHandlerOptions {
  selectedFormat: ImportFormat;
  setImportData: (data: string) => void;
  setSelectedFormat: (format: ImportFormat) => void;
  generatePreview: (data: string, format: ImportFormat) => void;
}

export function useFileHandler({
  selectedFormat,
  setImportData,
  setSelectedFormat,
  generatePreview,
}: UseFileHandlerOptions) {
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
    [selectedFormat, setImportData, setSelectedFormat, generatePreview]
  );

  return { handleFileUpload };
}
