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
        <div className="text-sm font-medium text-gray-400">
          Import from: {selectedSource.icon} {selectedSource.name}
        </div>
        <Button onClick={onChangeSource} variant="outline" size="sm">
          Change Source
        </Button>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-400">
          Upload File
        </label>
        <input
          type="file"
          accept=".csv,.tsv,.txt,.json"
          onChange={onFileUpload}
          className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-[#8b7aaa]/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#8b7aaa] hover:file:bg-[#8b7aaa]/30"
        />
      </div>

      <div className="text-center text-sm text-gray-400">or</div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-400">
          Paste Data
        </label>
        <textarea
          value={importData}
          onChange={(e) => onDataChange(e.target.value)}
          placeholder={`Example format:\n${selectedSource.example}`}
          className="h-32 w-full rounded-md border border-[#443a5c] bg-[#1a1625] px-3 py-2 font-mono text-sm text-white placeholder-gray-500 shadow-sm focus:border-[#8b7aaa] focus:ring-1 focus:ring-[#8b7aaa] focus:outline-none"
          disabled={isProcessing}
        />
      </div>

      {isProcessing && (
        <div className="py-4 text-center">
          <div className="text-gray-400">Processing...</div>
        </div>
      )}
    </div>
  );
}
