/**
 * Utility functions for CollectionImporter
 */

import type { PreviewCardData } from './types';

/**
 * Parse CSV format data and return preview cards
 */
export function parseCSVPreview(data: string): PreviewCardData[] {
  const lines = data.trim().split('\n');
  const startIndex = lines[0]?.toLowerCase().includes('name') ? 1 : 0;

  return lines
    .slice(startIndex, Math.min(startIndex + 5, lines.length))
    .filter((line) => line.trim())
    .map((line) => {
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      return {
        cardName: parts[0]?.trim().replace(/^["']|["']$/g, ''),
        quantity: parseInt(parts[1]?.trim()) || 0,
        setName: parts[2]?.trim().replace(/^["']|["']$/g, ''),
        setNumber: parts[3]?.trim().replace(/^["']|["']$/g, ''),
      };
    });
}

/**
 * Parse JSON format data and return preview cards
 */
export function parseJSONPreview(data: string): PreviewCardData[] {
  const jsonData = JSON.parse(data);
  if (!Array.isArray(jsonData)) {
    return [];
  }

  return jsonData.slice(0, 5).map((item) => ({
    cardName: item.cardName || item.name,
    quantity: parseInt(item.quantity) || parseInt(item.count) || 1,
    setName: item.setName || item.set,
    cardId: item.cardId || item.id,
  }));
}

/**
 * Parse decklist or MTGA format data and return preview cards
 */
export function parseDecklistPreview(data: string): PreviewCardData[] {
  const deckLines = data.trim().split('\n');

  return deckLines
    .slice(0, 5)
    .filter(
      (line) => line.trim() && !line.startsWith('//') && !line.startsWith('#')
    )
    .map((line) => {
      const match = line.match(/^(\d+)x?\s+(.+)$/);
      if (match) {
        return {
          cardName: match[2].trim(),
          quantity: parseInt(match[1]),
        };
      }
      return null;
    })
    .filter((card): card is PreviewCardData => card !== null);
}

/**
 * Validate preview card data
 */
export function isValidPreviewCard(card: unknown): card is PreviewCardData {
  return Boolean(
    card &&
      typeof card === 'object' &&
      'cardName' in card &&
      'quantity' in card &&
      card.cardName &&
      typeof card.quantity === 'number' &&
      card.quantity > 0
  );
}
