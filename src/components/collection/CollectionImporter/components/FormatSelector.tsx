/**
 * Format selector component
 */

import React from 'react';
import { Select } from '@/components/ui';
import { getFormatDescription } from '../';
import type { ImportFormat } from '../types';

interface FormatSelectorProps {
  selectedFormat: ImportFormat;
  onFormatChange: (format: ImportFormat) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-400">
        Import Format
      </label>
      <Select
        value={selectedFormat}
        onChange={(value: string) => onFormatChange(value as ImportFormat)}
        options={[
          { value: 'csv', label: 'CSV/TSV File' },
          { value: 'json', label: 'JSON Format' },
          { value: 'decklist', label: 'Deck List' },
          { value: 'mtga', label: 'MTG Arena Format' },
        ]}
      />
      <div className="mt-1 text-xs text-gray-400">
        {getFormatDescription(selectedFormat)}
      </div>
    </div>
  );
};
