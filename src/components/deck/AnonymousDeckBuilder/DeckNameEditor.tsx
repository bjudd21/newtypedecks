/**
 * DeckNameEditor Component
 * Deck name input field with edit mode toggle
 */

import React from 'react';
import { Input, Button } from '@/components/ui';

interface DeckNameEditorProps {
  deckName: string;
  isEditing: boolean;
  onDeckNameChange: (name: string) => void;
  onEditToggle: () => void;
}

export const DeckNameEditor: React.FC<DeckNameEditorProps> = ({
  deckName,
  isEditing,
  onDeckNameChange,
  onEditToggle,
}) => {
  return (
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
        onClick={onEditToggle}
        variant={isEditing ? 'default' : 'outline'}
      >
        {isEditing ? 'Done Editing' : 'Edit Deck'}
      </Button>
    </div>
  );
};
