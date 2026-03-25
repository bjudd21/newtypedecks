/**
 * ImportCodePanel
 * Input field + Load button for importing a deck from a deck code.
 * Calls GET /api/decks/by-code and passes the result to onImport.
 */

'use client';

import React, { useState } from 'react';
import { Input, Button } from '@/components/ui';
import type { CardWithRelations } from '@/lib/types/card';

interface ImportedCard {
  cardId: string;
  card: CardWithRelations;
  quantity: number;
  category: string;
}

interface ImportCodePanelProps {
  onImport: (cards: ImportedCard[], deckName: string) => void;
}

export const ImportCodePanel: React.FC<ImportCodePanelProps> = ({
  onImport,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/decks/by-code?code=${encodeURIComponent(trimmed)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Deck not found');
        return;
      }
      onImport(data.cards, data.name);
      setCode('');
    } catch {
      setError('Failed to load deck. Check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-1.5 border-t border-[#3a3050] pt-4">
      <label className="text-muted-foreground/70 text-xs font-medium">
        Import by deck code
      </label>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="NTDK-GN-xxxxxxxx"
          className="h-9 font-mono text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
        />
        <Button
          variant="outline"
          onClick={handleLoad}
          disabled={!code.trim() || loading}
          className="h-9 shrink-0 px-3 text-sm"
        >
          {loading ? 'Loading…' : 'Load'}
        </Button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
