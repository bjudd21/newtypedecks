/**
 * Custom hook for template creator state management
 */

import { useState } from 'react';

interface UseTemplateCreatorStateOptions {
  deckName: string;
}

export function useTemplateCreatorState({
  deckName,
}: UseTemplateCreatorStateOptions) {
  const [isCreating, setIsCreating] = useState(false);
  const [templateName, setTemplateName] = useState(`${deckName} Template`);
  const [templateDescription, setTemplateDescription] = useState(
    `Community template based on ${deckName}. A well-balanced deck suitable for competitive play.`
  );
  const [templateSource, setTemplateSource] = useState('Community');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTemplateName(`${deckName} Template`);
    setTemplateDescription(
      `Community template based on ${deckName}. A well-balanced deck suitable for competitive play.`
    );
    setTemplateSource('Community');
  };

  return {
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
  };
}
