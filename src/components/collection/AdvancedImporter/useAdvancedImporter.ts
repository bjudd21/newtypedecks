/**
 * Custom hook for Advanced Importer logic
 */

import { useState, useCallback } from 'react';
import type {
  ImportSource,
  ImportOptions,
  ImportStep,
  ValidationError,
  PreviewCard,
} from './types';
import {
  parseCSVData,
  parseJSONData,
  parseDecklistData,
} from '../utils/importParsers';

export function useAdvancedImporter(
  initialSource: ImportSource,
  onImportComplete?: (result: unknown) => void
) {
  const [selectedSource, setSelectedSource] =
    useState<ImportSource>(initialSource);
  const [importData, setImportData] = useState<string>('');
  const [importOptions, setImportOptions] = useState<ImportOptions>({
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
  const [currentStep, setCurrentStep] = useState<ImportStep>('select');

  const handleSourceSelect = useCallback((source: ImportSource) => {
    setSelectedSource(source);
    setImportData('');
    setValidationErrors([]);
    setPreviewData([]);
    setCurrentStep('data');
  }, []);

  const validateAndPreview = useCallback(
    (data: string) => {
      if (!data.trim()) {
        setValidationErrors([]);
        setPreviewData([]);
        return;
      }

      let errors: ValidationError[] = [];
      let preview: PreviewCard[] = [];

      try {
        switch (selectedSource.format) {
          case 'csv': {
            const result = parseCSVData(data);
            errors = result.errors;
            preview = result.preview;
            break;
          }
          case 'json': {
            const result = parseJSONData(data);
            errors = result.errors;
            preview = result.preview;
            break;
          }
          case 'decklist': {
            const result = parseDecklistData(data);
            errors = result.errors;
            preview = result.preview;
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

      if (errors.length === 0 && preview.length > 0) {
        setCurrentStep('validate');
      }
    },
    [selectedSource.format]
  );

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
    [validateAndPreview]
  );

  const handleDataChange = useCallback(
    (data: string) => {
      setImportData(data);
      validateAndPreview(data);
    },
    [validateAndPreview]
  );

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

  return {
    selectedSource,
    importData,
    importOptions,
    isProcessing,
    validationErrors,
    previewData,
    currentStep,
    setCurrentStep,
    setImportOptions,
    handleSourceSelect,
    handleFileUpload,
    handleDataChange,
    handleImport,
  };
}
