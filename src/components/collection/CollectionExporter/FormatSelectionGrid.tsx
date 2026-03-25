/**
 * FormatSelectionGrid Component
 * Grid of export format selection cards
 */

import React from 'react';
import { Badge } from '@/components/ui';

export interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: string;
  fileExtension: string;
  supportsOptions?: boolean;
}

interface FormatSelectionGridProps {
  formats: ExportFormat[];
  selectedFormat: ExportFormat;
  onFormatSelect: (format: ExportFormat) => void;
}

export const FormatSelectionGrid: React.FC<FormatSelectionGridProps> = ({
  formats,
  selectedFormat,
  onFormatSelect,
}) => {
  return (
    <div>
      <div className="text-muted-foreground mb-3 text-sm font-medium">
        Choose Export Format:
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {formats.map((format) => (
          <div
            key={format.id}
            onClick={() => onFormatSelect(format)}
            className={`cursor-pointer rounded-lg border p-4 transition-colors ${
              selectedFormat.id === format.id
                ? 'border-primary bg-accent'
                : 'border-border hover:border-primary hover:bg-background'
            }`}
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="text-2xl">{format.icon}</span>
              <div>
                <div className="text-foreground font-medium">{format.name}</div>
                <div className="text-muted-foreground text-sm">
                  {format.description}
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              .{format.fileExtension}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
