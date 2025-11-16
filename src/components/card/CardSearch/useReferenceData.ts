/**
 * useReferenceData Hook
 * Fetches reference data for card filters (types, rarities, sets)
 */

import { useState, useCallback, useEffect } from 'react';

export interface ReferenceData {
  types: Array<{ id: string; name: string; description?: string }>;
  rarities: Array<{
    id: string;
    name: string;
    color: string;
    description?: string;
  }>;
  sets: Array<{
    id: string;
    name: string;
    code: string;
    releaseDate: string;
    description?: string;
  }>;
}

export function useReferenceData() {
  const [referenceData, setReferenceData] = useState<ReferenceData>({
    types: [],
    rarities: [],
    sets: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReferenceData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/reference');

      if (response.ok) {
        const data = await response.json();
        setReferenceData({
          types: data.types || [],
          rarities: data.rarities || [],
          sets: data.sets || [],
        });
      } else {
        throw new Error('Failed to fetch reference data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to fetch reference data:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferenceData();
  }, [fetchReferenceData]);

  return {
    referenceData,
    isLoading,
    error,
    refetch: fetchReferenceData,
  };
}
