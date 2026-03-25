/**
 * ExportOptionsPanel Component
 * Export options with checkboxes and custom name input
 */

import React from 'react';
import { Input } from '@/components/ui';

interface ExportOptions {
  includeMetadata: boolean;
  includeConditions: boolean;
  includeValues: boolean;
  onlyOwned: boolean;
  customName: string;
}

interface ExportOptionsPanelProps {
  options: ExportOptions;
  onOptionChange: (option: string, value: unknown) => void;
}

export const ExportOptionsPanel: React.FC<ExportOptionsPanelProps> = ({
  options,
  onOptionChange,
}) => {
  return (
    <div>
      <div className="text-muted-foreground mb-3 text-sm font-medium">
        Export Options:
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left column */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="onlyOwned"
              checked={options.onlyOwned}
              onChange={(e) => onOptionChange('onlyOwned', e.target.checked)}
              className="border-border text-primary focus:ring-ring rounded"
            />
            <label
              htmlFor="onlyOwned"
              className="text-muted-foreground text-sm"
            >
              Only export owned cards (quantity &gt; 0)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeMetadata"
              checked={options.includeMetadata}
              onChange={(e) =>
                onOptionChange('includeMetadata', e.target.checked)
              }
              className="border-border text-primary focus:ring-ring rounded"
            />
            <label
              htmlFor="includeMetadata"
              className="text-muted-foreground text-sm"
            >
              Include metadata (dates, IDs)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeConditions"
              checked={options.includeConditions}
              onChange={(e) =>
                onOptionChange('includeConditions', e.target.checked)
              }
              className="border-border text-primary focus:ring-ring rounded"
            />
            <label
              htmlFor="includeConditions"
              className="text-muted-foreground text-sm"
            >
              Include card conditions
            </label>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeValues"
              checked={options.includeValues}
              onChange={(e) =>
                onOptionChange('includeValues', e.target.checked)
              }
              className="border-border text-primary focus:ring-ring rounded"
            />
            <label
              htmlFor="includeValues"
              className="text-muted-foreground text-sm"
            >
              Include market values
            </label>
          </div>

          <div>
            <label className="text-muted-foreground mb-1 block text-sm font-medium">
              Custom Export Name (optional)
            </label>
            <Input
              value={options.customName}
              onChange={(e) => onOptionChange('customName', e.target.value)}
              placeholder="e.g., tournament-collection"
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
