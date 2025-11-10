'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
} from '@/components/ui';

interface DeckTemplateCreatorProps {
  deckId: string;
  deckName: string;
  deckDescription?: string;
  cardCount: number;
  onTemplateCreated?: (templateId: string) => void;
  className?: string;
}

export const DeckTemplateCreator: React.FC<DeckTemplateCreatorProps> = ({
  deckId,
  deckName,
  deckDescription,
  cardCount,
  onTemplateCreated,
  className,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [templateName, setTemplateName] = useState(`${deckName} Template`);
  const [templateDescription, setTemplateDescription] = useState(
    `Community template based on ${deckName}. A well-balanced deck suitable for competitive play.`
  );
  const [templateSource, setTemplateSource] = useState('Community');
  const [error, setError] = useState<string | null>(null);

  const handleCreateTemplate = async () => {
    if (!templateName.trim()) {
      setError('Template name is required');
      return;
    }

    if (cardCount === 0) {
      setError('Cannot create template from empty deck');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deckId,
          templateName: templateName.trim(),
          templateDescription: templateDescription.trim(),
          templateSource: templateSource,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create template');
      }

      const result = await response.json();
      console.warn(`Template "${result.template.name}" created successfully!`);

      // Reset form
      setTemplateName(`${deckName} Template`);
      setTemplateDescription(
        `Community template based on ${deckName}. A well-balanced deck suitable for competitive play.`
      );
      setTemplateSource('Community');

      if (onTemplateCreated) {
        onTemplateCreated(result.template.id);
      }
    } catch (err) {
      console.error('Error creating template:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to create template'
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Create Template</CardTitle>
          <div className="text-sm text-gray-600">
            Share this deck with the community by creating a public template
            that others can use.
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Template Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Template Name *
              </label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name..."
                className="w-full"
              />
            </div>

            {/* Template Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Describe this template's strategy, strengths, and when to use it..."
                className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
              <div className="mt-1 text-xs text-gray-500">
                Help other players understand when and how to use this template.
              </div>
            </div>

            {/* Template Source */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Source Type
              </label>
              <Select
                value={templateSource}
                onChange={setTemplateSource}
                options={[
                  { value: 'Community', label: 'Community' },
                  { value: 'Tournament', label: 'Tournament' },
                  { value: 'Competitive', label: 'Competitive' },
                  { value: 'Casual', label: 'Casual' },
                  { value: 'Beginner', label: 'Beginner-Friendly' },
                ]}
              />
              <div className="mt-1 text-xs text-gray-500">
                Choose the category that best describes this deck template.
              </div>
            </div>

            {/* Current Deck Stats */}
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="mb-2 text-sm font-medium text-gray-900">
                Current Deck:
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  <strong>{deckName}</strong>
                </div>
                <div>{cardCount} cards</div>
                {deckDescription && (
                  <div className="col-span-2 text-xs">{deckDescription}</div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Template Guidelines */}
            <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
              <div className="mb-2 font-medium">Template Guidelines:</div>
              <ul className="space-y-1 text-xs">
                <li>• Templates become public and can be used by anyone</li>
                <li>
                  • Choose descriptive names and provide helpful descriptions
                </li>
                <li>• Ensure your deck is complete and well-balanced</li>
                <li>• Templates help new players learn different strategies</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCreateTemplate}
                disabled={isCreating || !templateName.trim() || cardCount === 0}
                variant="default"
                className="flex-1"
              >
                {isCreating ? 'Creating Template...' : 'Create Template'}
              </Button>
            </div>

            {/* Success Note */}
            <div className="text-center text-xs text-gray-500">
              Once created, your template will be available in the community
              template browser for others to discover and use.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckTemplateCreator;
