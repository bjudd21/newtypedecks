/**
 * Card Finder for Collection Import
 *
 * Utilities for finding cards by various identifiers
 */

import { prisma } from '@/lib/database';
import type { ImportCard } from './types';

/**
 * Find a card by various identifiers
 * Tries in order: cardId, set+setNumber, cardName
 * @param importCard - Import card data with identifiers
 * @returns Card with id and name, or null if not found
 */
export async function findCard(importCard: ImportCard) {
  // Try by card ID first if provided
  if (importCard.cardId) {
    return await prisma.card.findUnique({
      where: { id: importCard.cardId },
      select: { id: true, name: true },
    });
  }

  // Try by set number and set name
  if (importCard.setNumber && importCard.setName) {
    const set = await prisma.set.findFirst({
      where: {
        OR: [
          { name: { equals: importCard.setName, mode: 'insensitive' } },
          { code: { equals: importCard.setName, mode: 'insensitive' } },
        ],
      },
    });

    if (set) {
      return await prisma.card.findUnique({
        where: {
          setId_setNumber: {
            setId: set.id,
            setNumber: importCard.setNumber,
          },
        },
        select: { id: true, name: true },
      });
    }
  }

  // Try by exact card name match
  if (importCard.cardName) {
    return await prisma.card.findFirst({
      where: { name: { equals: importCard.cardName, mode: 'insensitive' } },
      select: { id: true, name: true },
    });
  }

  return null;
}
