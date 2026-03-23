/**
 * DeckSettings Component
 * Settings panel for deck configuration (description, format, visibility)
 */

'use client';

import React from 'react';
import type { DeckVisibility } from '@prisma/client';
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
}

export const DeckSettings: React.FC<DeckSettingsProps> = ({
  deckDescription,
  setDeckDescription,
  deckFormat,
  setDeckFormat,
  visibility,
  setVisibility,
}) => (
  <div className="grid grid-cols-1 gap-4 rounded-lg border border-[#443a5c] bg-[#2d2640] p-4 md:grid-cols-3">
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-400">
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
      <label className="mb-1 block text-sm font-medium text-gray-400">
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
      <label className="mb-1 block text-sm font-medium text-gray-400">
        Visibility
      </label>
      <Select
        value={visibility}
        onChange={(v) => setVisibility(v as DeckVisibility)}
        options={VISIBILITY_OPTIONS}
      />
    </div>
  </div>
);
