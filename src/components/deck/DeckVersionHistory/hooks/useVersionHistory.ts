'use client';
/**
 * Hook for managing version history state and fetching
 */

import { useState, useEffect } from 'react';
import type { DeckVersion } from '../types';

export function useVersionHistory(deckId: string) {
  const [versions, setVersions] = useState<DeckVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<DeckVersion | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch version history
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/decks/${deckId}/versions`);
        if (!response.ok) {
          throw new Error('Failed to fetch version history');
        }

        const data = await response.json();
        setVersions(data.versions || []);
      } catch (err) {
        console.error('Error fetching versions:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load version history'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (deckId) {
      fetchVersions();
    }
  }, [deckId]);

  // Handle version selection for detailed view
  const handleVersionSelect = async (version: DeckVersion) => {
    if (selectedVersion?.id === version.id) {
      setSelectedVersion(null);
      return;
    }

    try {
      const response = await fetch(
        `/api/decks/${deckId}/versions/${version.id}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch version details');
      }

      const data = await response.json();
      setSelectedVersion(data.version);
    } catch (err) {
      console.error('Error fetching version details:', err);
      console.warn('Failed to load version details');
    }
  };

  return {
    versions,
    setVersions,
    selectedVersion,
    setSelectedVersion,
    isLoading,
    error,
    setError,
    handleVersionSelect,
  };
}
