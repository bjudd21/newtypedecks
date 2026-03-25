/**
 * ImportResultDisplay Component
 * Displays import results with success/failed/skipped counts
 */

import React from 'react';

export interface ImportResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
  imported: Array<{
    cardName: string;
    quantity: number;
    action: 'added' | 'updated';
  }>;
}

interface ImportResultDisplayProps {
  result: ImportResult;
}

export const ImportResultDisplay: React.FC<ImportResultDisplayProps> = ({
  result,
}) => {
  return (
    <div className="rounded border border-green-900/50 bg-green-950/30 p-4">
      <div className="mb-2 font-medium text-green-400">Import Complete!</div>
      <div className="mb-3 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {result.success}
          </div>
          <div className="text-muted-foreground">Successful</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400">
            {result.skipped}
          </div>
          <div className="text-muted-foreground">Skipped</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">{result.failed}</div>
          <div className="text-muted-foreground">Failed</div>
        </div>
      </div>

      {result.errors.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-medium text-red-400">
            View Errors ({result.errors.length})
          </summary>
          <div className="mt-2 max-h-32 overflow-y-auto rounded bg-red-950/50 p-2 text-xs text-red-400">
            {result.errors.map((error, index) => (
              <div key={index}>• {error}</div>
            ))}
          </div>
        </details>
      )}

      {result.imported.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-medium text-green-400">
            View Imported Cards ({result.imported.length})
          </summary>
          <div className="mt-2 max-h-32 overflow-y-auto rounded bg-green-950/50 p-2 text-xs">
            {result.imported.slice(0, 10).map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-foreground w-6">{item.quantity}x</span>
                <span className="text-foreground flex-1">{item.cardName}</span>
                <span
                  className={`rounded px-1 text-xs ${
                    item.action === 'added'
                      ? 'bg-primary/30 text-primary'
                      : 'bg-orange-900/30 text-orange-400'
                  }`}
                >
                  {item.action}
                </span>
              </div>
            ))}
            {result.imported.length > 10 && (
              <div className="text-muted-foreground mt-1">
                ... and {result.imported.length - 10} more
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  );
};
