/**
 * DeckTemplateCreatorContent - Main component orchestrator
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useTemplateCreatorState } from './hooks/useTemplateCreatorState';
import { useTemplateCreatorHandler } from './hooks/useTemplateCreatorHandler';
import { TemplateFormFields } from './ui/TemplateFormFields';
import { CurrentDeckStats } from './ui/CurrentDeckStats';
import { TemplateGuidelines } from './ui/TemplateGuidelines';
import { TemplateCreatorActions } from './ui/TemplateCreatorActions';
import type { DeckTemplateCreatorProps } from './types';

export const DeckTemplateCreatorContent: React.FC<DeckTemplateCreatorProps> = ({
  deckId,
  deckName,
  deckDescription,
  cardCount,
  onTemplateCreated,
  className,
}) => {
  // State management
  const {
    isCreating,
    setIsCreating,
    templateName,
    setTemplateName,
    templateDescription,
    setTemplateDescription,
    templateSource,
    setTemplateSource,
    error,
    setError,
    resetForm,
  } = useTemplateCreatorState({ deckName });

  // Handler
  const { handleCreateTemplate } = useTemplateCreatorHandler({
    deckId,
    templateName,
    templateDescription,
    templateSource,
    cardCount,
    setIsCreating,
    setError,
    resetForm,
    onTemplateCreated,
  });

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Create Template</CardTitle>
          <div className="text-muted-foreground text-sm">
            Share this deck with the community by creating a public template
            that others can use.
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Form Fields */}
            <TemplateFormFields
              templateName={templateName}
              templateDescription={templateDescription}
              templateSource={templateSource}
              onTemplateNameChange={setTemplateName}
              onTemplateDescriptionChange={setTemplateDescription}
              onTemplateSourceChange={setTemplateSource}
            />

            {/* Current Deck Stats */}
            <CurrentDeckStats
              deckName={deckName}
              cardCount={cardCount}
              deckDescription={deckDescription}
            />

            {/* Error Display */}
            {error && (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Template Guidelines */}
            <TemplateGuidelines />

            {/* Action Buttons */}
            <TemplateCreatorActions
              isCreating={isCreating}
              templateName={templateName}
              cardCount={cardCount}
              onCreateTemplate={handleCreateTemplate}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckTemplateCreatorContent;
