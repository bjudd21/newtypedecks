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
      <div className="text-muted-foreground text-sm font-medium">
        Import Options
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-muted-foreground mb-1 block text-sm font-medium">
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
          <label className="text-muted-foreground mb-1 block text-sm font-medium">
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
          className="border-border text-primary focus:ring-ring rounded"
        />
        <label
          htmlFor="skipDuplicates"
          className="text-muted-foreground text-sm"
        >
          Skip duplicate entries in import data
        </label>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onImport}
          disabled={isProcessing}
          className="bg-primary hover:bg-primary/90"
        >
          {isProcessing ? 'IMPORTING...' : 'START IMPORT'}
        </Button>
        <Button
          onClick={onBack}
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-foreground"
        >
          Back to Preview
        </Button>
      </div>
    </div>
  );
}
