/**
 * Step 1: Source Selection
 */

import React from 'react';
import type { ImportSource } from './types';

interface SourceSelectionStepProps {
  sources: ImportSource[];
  onSelectSource: (source: ImportSource) => void;
}

export function SourceSelectionStep({
  sources,
  onSelectSource,
}: SourceSelectionStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-muted-foreground mb-3 text-sm font-medium">
        Choose your import source:
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {sources.map((source) => (
          <div
            key={source.id}
            onClick={() => onSelectSource(source)}
            className="border-border hover:border-primary hover:bg-accent cursor-pointer rounded-lg border p-4 transition-colors"
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="text-2xl">{source.icon}</span>
              <div>
                <div className="font-medium text-white">{source.name}</div>
                <div className="text-muted-foreground text-sm">
                  {source.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
