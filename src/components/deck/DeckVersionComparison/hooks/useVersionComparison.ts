/**
 * Hook for managing version comparison state
 */

import { useMemo } from 'react';
import { calculateChanges } from '../utils';
import type { DeckVersion } from '../types';

export function useVersionComparison(versionA: DeckVersion, versionB: DeckVersion) {
  const changes = useMemo(
    () => calculateChanges(versionA, versionB),
    [versionA, versionB]
  );

  const addedCards = useMemo(
    () => changes.filter((c) => c.type === 'added'),
    [changes]
  );

  const removedCards = useMemo(
    () => changes.filter((c) => c.type === 'removed'),
    [changes]
  );

  const modifiedCards = useMemo(
    () => changes.filter((c) => c.type === 'modified'),
    [changes]
  );

  const unchangedCards = useMemo(
    () => changes.filter((c) => c.type === 'unchanged'),
    [changes]
  );

  return {
    changes,
    addedCards,
    removedCards,
    modifiedCards,
    unchangedCards,
  };
}
