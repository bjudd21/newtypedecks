/**
 * Step 2: Data Input
 */

import React from 'react';
import { Button } from '@/components/ui';
import type { ImportSource } from './types';

interface DataInputStepProps {
  selectedSource: ImportSource;
  importData: string;
  isProcessing: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDataChange: (data: string) => void;
  onChangeSource: () => void;
}

export function DataInputStep({
  selectedSource,
  importData,
  isProcessing,
  onFileUpload,
  onDataChange,
  onChangeSource,
}: DataInputStepProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm font-medium">
          Import from: {selectedSource.icon} {selectedSource.name}
        </div>
        <Button onClick={onChangeSource} variant="outline" size="sm">
          Change Source
        </Button>
      </div>

      <div>
        <label className="text-muted-foreground mb-2 block text-sm font-medium">
          Upload File
        </label>
        <input
          type="file"
          accept=".csv,.tsv,.txt,.json"
          onChange={onFileUpload}
          className="text-muted-foreground file:bg-primary/20 file:text-primary hover:file:bg-primary/30 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
        />
      </div>

      <div className="text-muted-foreground text-center text-sm">or</div>

      <div>
        <label className="text-muted-foreground mb-2 block text-sm font-medium">
          Paste Data
        </label>
        <textarea
          value={importData}
          onChange={(e) => onDataChange(e.target.value)}
          placeholder={`Example format:\n${selectedSource.example}`}
          className="border-border bg-background placeholder:text-muted-foreground/50 focus:border-primary focus:ring-ring h-32 w-full rounded-md border px-3 py-2 font-mono text-sm text-white shadow-sm focus:ring-1 focus:outline-none"
          disabled={isProcessing}
        />
      </div>

      {isProcessing && (
        <div className="py-4 text-center">
          <div className="text-muted-foreground">Processing...</div>
        </div>
      )}
    </div>
  );
}
