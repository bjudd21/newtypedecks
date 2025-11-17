/**
 * Custom hook for comments effects
 */

import { useEffect } from 'react';

interface UseCommentsEffectsOptions {
  deckId: string;
  loadComments: () => void;
}

export function useCommentsEffects({
  deckId,
  loadComments,
}: UseCommentsEffectsOptions) {
  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId]);
}
