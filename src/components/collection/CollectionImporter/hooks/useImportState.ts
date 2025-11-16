/**
 * Hook for managing CollectionImporter state
 */

import { useState } from 'react';
import type { PreviewCard } from '@/lib/types';
import type { ImportFormat, UpdateBehavior } from '../types';
import type { ImportResult } from '../';

export function useImportState() {
  const [selectedFormat, setSelectedFormat] = useState<ImportFormat>('csv');
  const [importData, setImportData] = useState<string>('');
  const [updateBehavior, setUpdateBehavior] = useState<UpdateBehavior>('add');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewCards, setPreviewCards] = useState<PreviewCard[]>([]);

  const clearAll = () => {
    setImportData('');
    setPreviewCards([]);
    setImportResult(null);
    setError(null);
  };

  return {
    selectedFormat,
    setSelectedFormat,
    importData,
    setImportData,
    updateBehavior,
    setUpdateBehavior,
    isImporting,
    setIsImporting,
    importResult,
    setImportResult,
    error,
    setError,
    previewCards,
    setPreviewCards,
    clearAll,
  };
}
