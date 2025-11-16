/**
 * DeckSettings Component
 * Settings panel for deck configuration (description, format, visibility)
 */

'use client';

import React from 'react';
import { Input, Select } from '@/components/ui';

interface DeckSettingsProps {
  deckDescription: string;
  setDeckDescription: (value: string) => void;
  deckFormat: string;
  setDeckFormat: (value: string) => void;
  isPublic: boolean;
  setIsPublic: (value: boolean) => void;
}

export const DeckSettings: React.FC<DeckSettingsProps> = ({
  deckDescription,
  setDeckDescription,
  deckFormat,
  setDeckFormat,
  isPublic,
  setIsPublic,
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
    <div className="flex items-center space-x-2 pt-6">
      <input
        type="checkbox"
        id="isPublic"
        checked={isPublic}
        onChange={(e) => setIsPublic(e.target.checked)}
        className="rounded border-gray-300 text-[#8b7aaa] focus:ring-[#8b7aaa]"
      />
      <label htmlFor="isPublic" className="text-sm text-gray-400">
        Make deck public
      </label>
    </div>
  </div>
);
