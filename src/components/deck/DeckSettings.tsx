/**
 * DeckSettings Component
 * Settings panel for deck configuration (description, format, visibility)
 */

'use client';

import React from 'react';
import type { DeckVisibility, DeckRuleset } from '@prisma/client';
import { Input, Select } from '@/components/ui';

const VISIBILITY_OPTIONS = [
  { value: 'DRAFT', label: 'Draft — save anytime, only visible to you' },
  { value: 'PRIVATE', label: 'Private — shareable by link, valid decks only' },
  { value: 'PUBLIC', label: 'Public — visible in deck library' },
];

interface DeckSettingsProps {
  deckDescription: string;
  setDeckDescription: (value: string) => void;
  deckFormat: string;
  setDeckFormat: (value: string) => void;
  visibility: DeckVisibility;
  setVisibility: (value: DeckVisibility) => void;
  ruleset: DeckRuleset;
  setRuleset: (value: DeckRuleset) => void;
}

export const DeckSettings: React.FC<DeckSettingsProps> = ({
  deckDescription,
  setDeckDescription,
  deckFormat,
  setDeckFormat,
  visibility,
  setVisibility,
  ruleset,
  setRuleset,
}) => (
  <div className="border-border bg-card space-y-4 rounded-lg border p-4">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div>
        <label className="text-muted-foreground mb-1 block text-sm font-medium">
          Description
        </label>
        <Input
          value={deckDescription}
          onChange={(e) => setDeckDescription(e.target.value)}
          placeholder="Deck description (optional)"
          className="text-sm"
        />
      </div>
      <div>
        <label className="text-muted-foreground mb-1 block text-sm font-medium">
          Format
        </label>
        <Select
          value={deckFormat}
          onChange={setDeckFormat}
          options={[
            { value: 'Standard', label: 'Standard' },
            { value: 'Advanced', label: 'Advanced' },
            { value: 'Casual', label: 'Casual' },
            { value: 'Custom', label: 'Custom' },
          ]}
        />
      </div>
      <div>
        <label className="text-muted-foreground mb-1 block text-sm font-medium">
          Visibility
        </label>
        <Select
          value={visibility}
          onChange={(v) => setVisibility(v as DeckVisibility)}
          options={VISIBILITY_OPTIONS}
        />
      </div>
    </div>

    {/* Ruleset toggle */}
    <div>
      <label className="text-muted-foreground mb-2 block text-sm font-medium">
        Ruleset
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setRuleset('COMPETITIVE')}
          className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            ruleset === 'COMPETITIVE'
              ? 'border-primary bg-primary/30 text-primary-foreground'
              : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground bg-transparent'
          }`}
        >
          Competitive — strict rules enforced
        </button>
        <button
          type="button"
          onClick={() => setRuleset('CASUAL')}
          className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            ruleset === 'CASUAL'
              ? 'border-amber-500 bg-amber-500/20 text-amber-300'
              : 'border-border text-muted-foreground hover:text-foreground bg-transparent hover:border-amber-500/50'
          }`}
        >
          Casual — warnings only, any deck saves
        </button>
      </div>
    </div>
  </div>
);
