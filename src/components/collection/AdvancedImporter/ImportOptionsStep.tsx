/**
 * Step 4: Import Options Configuration
 */

import React from 'react';
import { Button, Select } from '@/components/ui';
import type { ImportOptions } from './types';

interface ImportOptionsStepProps {
  importOptions: ImportOptions;
  isProcessing: boolean;
  onOptionsChange: (options: ImportOptions) => void;
  onImport: () => void;
  onBack: () => void;
}

export function ImportOptionsStep({
  importOptions,
  isProcessing,
  onOptionsChange,
  onImport,
  onBack,
}: ImportOptionsStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-400">Import Options</div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">
            Update Behavior
          </label>
          <Select
            value={importOptions.updateBehavior}
            onChange={(value: string) =>
              onOptionsChange({ ...importOptions, updateBehavior: value })
            }
            options={[
              { value: 'add', label: 'Add to existing quantities' },
              { value: 'replace', label: 'Replace existing quantities' },
              { value: 'skip', label: 'Skip existing cards' },
            ]}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">
            Batch Size
          </label>
          <Select
            value={importOptions.batchSize.toString()}
            onChange={(value: string) =>
              onOptionsChange({ ...importOptions, batchSize: parseInt(value) })
            }
            options={[
              { value: '50', label: '50 cards per batch' },
              { value: '100', label: '100 cards per batch' },
              { value: '250', label: '250 cards per batch' },
            ]}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="skipDuplicates"
          checked={importOptions.skipDuplicates}
          onChange={(e) =>
            onOptionsChange({
              ...importOptions,
              skipDuplicates: e.target.checked,
            })
          }
          className="rounded border-gray-300 text-[#8b7aaa] focus:ring-[#8b7aaa]"
        />
        <label htmlFor="skipDuplicates" className="text-sm text-gray-400">
          Skip duplicate entries in import data
        </label>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onImport}
          disabled={isProcessing}
          className="bg-gradient-to-r from-[#8b7aaa] to-[#6b5a8a] hover:from-[#a89ec7] hover:to-[#8b7aaa]"
        >
          {isProcessing ? 'IMPORTING...' : 'START IMPORT'}
        </Button>
        <Button
          onClick={onBack}
          variant="outline"
          className="border-[#8b7aaa] text-[#8b7aaa] hover:bg-[#8b7aaa] hover:text-white"
        >
          Back to Preview
        </Button>
      </div>
    </div>
  );
}
