/**
 * DeckStatusIndicator Component
 * Displays save status, version, and a copy-code button when a deck code exists.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Badge } from '@/components/ui';

interface DeckStatusIndicatorProps {
  isAuthenticated: boolean;
  savedDeckId: string | null;
  deckName: string;
  uniqueCards: number;
  currentVersion?: number;
  deckCode?: string | null;
}

export const DeckStatusIndicator: React.FC<DeckStatusIndicatorProps> = ({
  isAuthenticated,
  savedDeckId,
  deckName,
  uniqueCards,
  currentVersion,
  deckCode,
}) => {
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = useCallback(async () => {
    if (!deckCode) return;
    try {
      await navigator.clipboard.writeText(deckCode);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = deckCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }, [deckCode]);

  if (!isAuthenticated) return null;

  return (
    <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-3 text-sm">
      {savedDeckId ? (
        <>
          <span className="flex items-center gap-1">
            ✅ <strong>{deckName}</strong> is saved to your collection
            {currentVersion && (
              <Badge variant="secondary" className="ml-2 text-xs">
                v{currentVersion}
              </Badge>
            )}
          </span>

          {deckCode && (
            <button
              onClick={handleCopyCode}
              className="border-border bg-background/50 text-primary/80 hover:border-primary hover:text-primary flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-xs transition-colors"
              title="Copy deck code for sharing"
            >
              <span>{deckCode}</span>
              <span className="text-primary">
                {codeCopied ? '✓ Copied' : '📋'}
              </span>
            </button>
          )}
        </>
      ) : uniqueCards > 0 ? (
        <span className="flex items-center gap-1">
          ⚠️ <strong>{deckName}</strong> has unsaved changes
        </span>
      ) : (
        <span>Start adding cards to build your deck</span>
      )}
    </div>
  );
};
