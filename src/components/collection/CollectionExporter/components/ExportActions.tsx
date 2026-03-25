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
        className="bg-primary hover:bg-primary/90 flex-1"
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
          className="border-primary text-primary hover:bg-primary hover:text-foreground"
        >
          ADVANCED EXPORT
        </Button>
      )}
    </div>
  );
};
