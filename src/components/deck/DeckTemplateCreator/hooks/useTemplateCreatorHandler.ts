'use client';
/**
 * Custom hook for template creator handler
 */

import { useCallback } from 'react';

interface UseTemplateCreatorHandlerOptions {
  deckId: string;
  templateName: string;
  templateDescription: string;
  templateSource: string;
  cardCount: number;
  setIsCreating: (creating: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
  onTemplateCreated?: (templateId: string) => void;
}

export function useTemplateCreatorHandler({
  deckId,
  templateName,
  templateDescription,
  templateSource,
  cardCount,
  setIsCreating,
  setError,
  resetForm,
  onTemplateCreated,
}: UseTemplateCreatorHandlerOptions) {
  const handleCreateTemplate = useCallback(async () => {
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
      resetForm();

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
  }, [
    deckId,
    templateName,
    templateDescription,
    templateSource,
    cardCount,
    setIsCreating,
    setError,
    resetForm,
    onTemplateCreated,
  ]);

  return { handleCreateTemplate };
}
