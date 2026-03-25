/**
 * ExportGuidelinesInfo Component
 * Information about different export formats
 */

import React from 'react';

export const ExportGuidelinesInfo: React.FC = () => {
  return (
    <div className="border-border bg-background text-muted-foreground rounded border p-3 text-xs">
      <div className="mb-2 font-medium text-white">Export Guidelines:</div>
      <ul className="space-y-1">
        <li>
          • <strong>JSON:</strong> Complete backup with all data - best for
          re-importing
        </li>
        <li>
          • <strong>CSV:</strong> Spreadsheet format - good for analysis and
          editing
        </li>
        <li>
          • <strong>Text:</strong> Human-readable list - easy to view and print
        </li>
        <li>
          • <strong>Deck List:</strong> Simple format - compatible with other
          tools
        </li>
        <li>• All exports include proper file names with date stamps</li>
        <li>
          • Exports are generated in real-time from your current collection
        </li>
      </ul>
    </div>
  );
};
