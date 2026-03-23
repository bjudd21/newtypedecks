/**
 * DeckHeader Component
 * Header section with deck name, editing controls, and settings
 */

'use client';

import React from 'react';
import type { DeckVisibility, DeckRuleset } from '@prisma/client';
import { Input, Button } from '@/components/ui';
import { DeckSettings } from './DeckSettings';
import { FavoriteButton } from './FavoriteButton';

interface DeckHeaderProps {
  deckName: string;
  onDeckNameChange: (name: string) => void;
  isEditing: boolean;
  onToggleEditing: () => void;
  isAuthenticated: boolean;
  savedDeckId: string | null;
  showVersionHistory: boolean;
  onToggleVersionHistory: () => void;
  deckDescription: string;
  setDeckDescription: (value: string) => void;
  deckFormat: string;
  setDeckFormat: (value: string) => void;
  visibility: DeckVisibility;
  setVisibility: (value: DeckVisibility) => void;
  ruleset: DeckRuleset;
  setRuleset: (value: DeckRuleset) => void;
  deckError: string | null;
}

export const DeckHeader: React.FC<DeckHeaderProps> = ({
  deckName,
  onDeckNameChange,
  isEditing,
  onToggleEditing,
  isAuthenticated,
  savedDeckId,
  showVersionHistory,
  onToggleVersionHistory,
  deckDescription,
  setDeckDescription,
  deckFormat,
  setDeckFormat,
  visibility,
  setVisibility,
  ruleset,
  setRuleset,
  deckError,
}) => (
  <div className="mb-4 space-y-4">
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Input
          value={deckName}
          onChange={(e) => onDeckNameChange(e.target.value)}
          placeholder="Enter deck name..."
          className="text-lg font-semibold"
        />
      </div>
      <Button
        onClick={onToggleEditing}
        variant={isEditing ? 'default' : 'outline'}
      >
        {isEditing ? 'Done Editing' : 'Edit Deck'}
      </Button>

      {isAuthenticated && savedDeckId && (
        <>
          <Button
            onClick={onToggleVersionHistory}
            variant={showVersionHistory ? 'default' : 'outline'}
          >
            {showVersionHistory ? 'Hide History' : 'Version History'}
          </Button>
          <FavoriteButton
            deckId={savedDeckId}
            deckName={deckName}
            size="md"
            variant="button"
          />
        </>
      )}
    </div>

    {isAuthenticated && (
      <DeckSettings
        deckDescription={deckDescription}
        setDeckDescription={setDeckDescription}
        deckFormat={deckFormat}
        setDeckFormat={setDeckFormat}
        visibility={visibility}
        setVisibility={setVisibility}
        ruleset={ruleset}
        setRuleset={setRuleset}
      />
    )}

    {deckError && (
      <div className="rounded border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
        {deckError}
      </div>
    )}
  </div>
);
