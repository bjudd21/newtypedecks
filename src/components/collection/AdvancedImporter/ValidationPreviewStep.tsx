/**
 * Step 3: Validation & Preview
 */

import React from 'react';
import { Button, Badge } from '@/components/ui';
import type { ValidationError, PreviewCard } from './types';

interface ValidationPreviewStepProps {
  validationErrors: ValidationError[];
  previewData: PreviewCard[];
  onEditData: () => void;
  onContinueToOptions: () => void;
  onImportNow: () => void;
}

export function ValidationPreviewStep({
  validationErrors,
  previewData,
  onEditData,
  onContinueToOptions,
  onImportNow,
}: ValidationPreviewStepProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm font-medium">
          Validation & Preview
        </div>
        <Button onClick={onEditData} variant="outline" size="sm">
          Edit Data
        </Button>
      </div>

      {validationErrors.length > 0 && (
        <div className="rounded border border-red-900/50 bg-red-950/30 p-3">
          <div className="mb-2 font-medium text-red-400">
            Validation Errors ({validationErrors.length})
          </div>
          <div className="max-h-32 space-y-1 overflow-y-auto">
            {validationErrors.map((error, index) => (
              <div key={index} className="text-sm text-red-400">
                <strong>Line {error.line}:</strong> {error.error}
                {error.suggestion && (
                  <div className="ml-4 text-xs text-red-300">
                    💡 {error.suggestion}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {previewData.length > 0 && (
        <div className="rounded border border-green-900/50 bg-green-950/30 p-3">
          <div className="mb-2 font-medium text-green-400">
            Preview (first 10 items)
          </div>
          <div className="max-h-32 space-y-1 overflow-y-auto">
            {previewData.map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <Badge variant="secondary" className="text-xs">
                  {item.quantity}x
                </Badge>
                <span className="text-foreground flex-1">{item.cardName}</span>
                {item.setName && (
                  <span className="text-muted-foreground text-xs">
                    ({item.setName})
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-green-400">
            ✅ Ready to import {previewData.length}+ cards
          </div>
        </div>
      )}

      {validationErrors.length === 0 && previewData.length > 0 && (
        <div className="flex gap-2">
          <Button
            onClick={onContinueToOptions}
            className="bg-primary hover:bg-primary/90"
          >
            Continue to Options
          </Button>
          <Button
            onClick={onImportNow}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-foreground"
          >
            Import Now
          </Button>
        </div>
      )}
    </div>
  );
}
