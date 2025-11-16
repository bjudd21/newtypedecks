/**
 * Hook for generating import data previews
 */

import { useCallback } from 'react';
import type { PreviewCard } from '@/lib/types';
import type { ImportFormat } from '../types';
import {
  parseCSVPreview,
  parseJSONPreview,
  parseDecklistPreview,
  isValidPreviewCard,
} from '../utils';

interface UsePreviewGeneratorOptions {
  setPreviewCards: (cards: PreviewCard[]) => void;
}

export function usePreviewGenerator({
  setPreviewCards,
}: UsePreviewGeneratorOptions) {
  const generatePreview = useCallback(
    (data: string, format: ImportFormat) => {
      try {
        let preview: unknown[] = [];

        switch (format) {
          case 'csv':
            preview = parseCSVPreview(data);
            break;

          case 'json':
            preview = parseJSONPreview(data);
            break;

          case 'decklist':
          case 'mtga':
            preview = parseDecklistPreview(data);
            break;
        }

        setPreviewCards(
          preview.filter((card): card is PreviewCard =>
            isValidPreviewCard(card)
          )
        );
      } catch (error) {
        console.error('Preview generation failed:', error);
        setPreviewCards([]);
      }
    },
    [setPreviewCards]
  );

  return { generatePreview };
}
