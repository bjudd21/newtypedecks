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
      <label className="mb-2 block text-sm font-medium text-gray-400">
        Or Paste Data Manually
      </label>
      <textarea
        value={importData}
        onChange={(e) => onDataChange(e.target.value)}
        placeholder={`Example ${selectedFormat} format:\n${getFormatExample(selectedFormat)}`}
        className="h-32 w-full rounded-md border border-[#443a5c] bg-[#1a1625] px-3 py-2 font-mono text-sm text-white placeholder-gray-500 shadow-sm focus:border-[#8b7aaa] focus:ring-1 focus:ring-[#8b7aaa] focus:outline-none"
      />
    </div>
  );
};
