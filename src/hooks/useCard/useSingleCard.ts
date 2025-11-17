/**
 * Hook for managing a single card
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CardWithRelations } from '../../lib/types/card';

export function useCard(cardId: string | null) {
  const [card, setCard] = useState<CardWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCard = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/cards/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Card not found');
        }
        throw new Error(`Failed to fetch card: ${response.statusText}`);
      }

      const cardData: CardWithRelations = await response.json();
      setCard(cardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch card');
      console.error('Card fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cardId) {
      fetchCard(cardId);
    } else {
      setCard(null);
      setError(null);
    }
  }, [cardId, fetchCard]);

  return {
    card,
    isLoading,
    error,
    refetch: () => (cardId ? fetchCard(cardId) : null),
  };
}
