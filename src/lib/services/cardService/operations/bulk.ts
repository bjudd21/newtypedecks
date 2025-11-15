/**
 * Bulk Operations for Cards
 */

import { PrismaClient } from '@prisma/client';
import type { CardWithRelations, CreateCardData } from '@/lib/types/card';
import { createCard } from './crud';

/**
 * Bulk import cards
 */
export async function bulkImportCards(
  db: PrismaClient,
  cardsData: CreateCardData[]
): Promise<{
  successful: CardWithRelations[];
  failed: Array<{ data: CreateCardData; error: string }>;
}> {
  const successful: CardWithRelations[] = [];
  const failed: Array<{ data: CreateCardData; error: string }> = [];

  for (const cardData of cardsData) {
    try {
      const card = await createCard(db, cardData);
      successful.push(card);
    } catch (error) {
      failed.push({
        data: cardData,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return { successful, failed };
}
