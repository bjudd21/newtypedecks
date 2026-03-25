/**
 * Manual data input component
 */

import React from 'react';
import { getFormatExample } from '../';
import type { ImportFormat } from '../types';

interface ManualDataInputProps {
  selectedFormat: ImportFormat;
  importData: string;
  onDataChange: (data: string) => void;
}

export const ManualDataInput: React.FC<ManualDataInputProps> = ({
  selectedFormat,
  importData,
  onDataChange,
}) => {
  return (
    <div>
      <label className="text-muted-foreground mb-2 block text-sm font-medium">
        Or Paste Data Manually
      </label>
      <textarea
        value={importData}
        onChange={(e) => onDataChange(e.target.value)}
        placeholder={`Example ${selectedFormat} format:\n${getFormatExample(selectedFormat)}`}
        className="border-border bg-background placeholder:text-muted-foreground/50 focus:border-primary focus:ring-ring h-32 w-full rounded-md border px-3 py-2 font-mono text-sm text-white shadow-sm focus:ring-1 focus:outline-none"
      />
    </div>
  );
};
