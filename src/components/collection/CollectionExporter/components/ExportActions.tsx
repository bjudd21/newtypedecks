/**
 * Export actions component (Export buttons)
 */

import React from 'react';
import { Button } from '@/components/ui';
import type { ExportFormat } from '../FormatSelectionGrid';

interface ExportActionsProps {
  selectedFormat: ExportFormat;
  isExporting: boolean;
  onQuickExport: () => void;
  onAdvancedExport: () => void;
}

export const ExportActions: React.FC<ExportActionsProps> = ({
  selectedFormat,
  isExporting,
  onQuickExport,
  onAdvancedExport,
}) => {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onQuickExport}
        disabled={isExporting}
        className="flex-1 bg-gradient-to-r from-[#8b7aaa] to-[#6b5a8a] hover:from-[#a89ec7] hover:to-[#8b7aaa]"
      >
        {isExporting
          ? 'EXPORTING...'
          : `EXPORT AS ${selectedFormat.name.toUpperCase()}`}
      </Button>

      {selectedFormat.supportsOptions && (
        <Button
          onClick={onAdvancedExport}
          disabled={isExporting}
          variant="outline"
          className="border-[#8b7aaa] text-[#8b7aaa] hover:bg-[#8b7aaa] hover:text-white"
        >
          ADVANCED EXPORT
        </Button>
      )}
    </div>
  );
};
