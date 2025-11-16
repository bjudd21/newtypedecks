/**
 * useReferenceData Hook
 * Fetches and manages card reference data (types, rarities, sets)
 */

import { useState, useEffect } from 'react';
import type { ReferenceData, CardFormData } from './types';

export const useReferenceData = (
  initialData?: Partial<CardFormData>,
  setFormData?: React.Dispatch<React.SetStateAction<CardFormData>>
) => {
  const [referenceData, setReferenceData] = useState<ReferenceData>({
    types: [],
    rarities: [],
    sets: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReferenceData() {
      try {
        const [typesRes, raritiesRes, setsRes] = await Promise.all([
          fetch('/api/reference/types'),
          fetch('/api/reference/rarities'),
          fetch('/api/reference/sets'),
        ]);

        const [typesData, raritiesData, setsData] = await Promise.all([
          typesRes.json(),
          raritiesRes.json(),
          setsRes.json(),
        ]);

        const types = typesData.types || [];
        const rarities = raritiesData.rarities || [];
        const sets = setsData.sets || [];

        setReferenceData({ types, rarities, sets });

        // Set default values if creating new card
        if (!initialData && setFormData) {
          setFormData((prev) => ({
            ...prev,
            typeId: types[0]?.id || '',
            rarityId: rarities[0]?.id || '',
            setId: sets[0]?.id || '',
          }));
        }
      } catch (error) {
        console.error('Failed to load reference data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadReferenceData();
  }, [initialData, setFormData]);

  return { referenceData, isLoading };
};
