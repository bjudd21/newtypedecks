/**
 * Import Processor for Collection Import
 *
 * Handles processing of import cards and updating collections
 */

import { prisma } from '@/lib/database';
import type { ImportCard, ImportResult, ImportOptions } from './types';
import { findCard } from './cardFinder';

/**
 * Process import cards and update user collection
 * @param importCards - Array of cards to import
 * @param collectionId - User's collection ID
 * @param options - Import options (updateBehavior)
 * @returns Import result with success/failure counts and details
 */
export async function processImportCards(
  importCards: ImportCard[],
  collectionId: string,
  options: ImportOptions = {}
): Promise<ImportResult> {
  const result: ImportResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
    imported: [],
  };

  // Process each import card
  for (const importCard of importCards) {
    try {
      const card = await findCard(importCard);

      if (!card) {
        result.failed++;
        result.errors.push(
          `Card not found: ${importCard.cardName || importCard.cardId || 'unknown'}`
        );
        continue;
      }

      if (importCard.quantity <= 0) {
        result.skipped++;
        continue;
      }

      // Check if card already exists in collection
      const existingCollectionCard = await prisma.collectionCard.findUnique({
        where: {
          collectionId_cardId: {
            collectionId: collectionId,
            cardId: card.id,
          },
        },
      });

      const updateBehavior = options.updateBehavior || 'add'; // 'add', 'replace', 'skip'

      if (existingCollectionCard) {
        if (updateBehavior === 'skip') {
          result.skipped++;
          continue;
        }

        const newQuantity =
          updateBehavior === 'replace'
            ? importCard.quantity
            : existingCollectionCard.quantity + importCard.quantity;

        await prisma.collectionCard.update({
          where: { id: existingCollectionCard.id },
          data: { quantity: Math.max(0, newQuantity) },
        });

        result.success++;
        result.imported.push({
          cardName: card.name,
          quantity: newQuantity,
          action: 'updated',
        });
      } else {
        // Create new collection card
        await prisma.collectionCard.create({
          data: {
            collectionId: collectionId,
            cardId: card.id,
            quantity: importCard.quantity,
          },
        });

        result.success++;
        result.imported.push({
          cardName: card.name,
          quantity: importCard.quantity,
          action: 'added',
        });
      }
    } catch (error) {
      result.failed++;
      result.errors.push(
        `Failed to process card: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  return result;
}
