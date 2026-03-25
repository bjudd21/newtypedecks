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
      <label className="text-muted-foreground mb-2 block text-sm font-medium">
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
      <div className="text-muted-foreground mt-1 text-xs">
        {getFormatDescription(selectedFormat)}
      </div>
    </div>
  );
};
