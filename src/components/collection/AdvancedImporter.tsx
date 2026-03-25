'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { IMPORT_SOURCES } from './AdvancedImporter/constants';
import { useAdvancedImporter } from './AdvancedImporter/useAdvancedImporter';
import { StepIndicator } from './AdvancedImporter/StepIndicator';
import { SourceSelectionStep } from './AdvancedImporter/SourceSelectionStep';
import { DataInputStep } from './AdvancedImporter/DataInputStep';
import { ValidationPreviewStep } from './AdvancedImporter/ValidationPreviewStep';
import { ImportOptionsStep } from './AdvancedImporter/ImportOptionsStep';
import { ImportProgressStep } from './AdvancedImporter/ImportProgressStep';
import type { AdvancedImporterProps } from './AdvancedImporter/types';

export const AdvancedImporter: React.FC<AdvancedImporterProps> = ({
  onImportComplete,
  className,
}) => {
  const {
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
  } = useAdvancedImporter(IMPORT_SOURCES[0], onImportComplete);

  return (
    <div className={className}>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-primary/80">
            ADVANCED COLLECTION IMPORT
          </CardTitle>
          <StepIndicator currentStep={currentStep} />
        </CardHeader>
        <CardContent>
          {currentStep === 'select' && (
            <SourceSelectionStep
              sources={IMPORT_SOURCES}
              onSelectSource={handleSourceSelect}
            />
          )}

          {currentStep === 'data' && (
            <DataInputStep
              selectedSource={selectedSource}
              importData={importData}
              isProcessing={isProcessing}
              onFileUpload={handleFileUpload}
              onDataChange={handleDataChange}
              onChangeSource={() => setCurrentStep('select')}
            />
          )}

          {currentStep === 'validate' && (
            <ValidationPreviewStep
              validationErrors={validationErrors}
              previewData={previewData}
              onEditData={() => setCurrentStep('data')}
              onContinueToOptions={() => setCurrentStep('options')}
              onImportNow={handleImport}
            />
          )}

          {currentStep === 'options' && (
            <ImportOptionsStep
              importOptions={importOptions}
              isProcessing={isProcessing}
              onOptionsChange={setImportOptions}
              onImport={handleImport}
              onBack={() => setCurrentStep('validate')}
            />
          )}

          {currentStep === 'import' && <ImportProgressStep />}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedImporter;
