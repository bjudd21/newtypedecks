/**
 * CRUD Operations for Cards
 */

import { PrismaClient } from '@prisma/client';
import type {
  CardWithRelations,
  CreateCardData,
  UpdateCardData,
} from '@/lib/types/card';
import { CardValidator } from '@/lib/models/card';
import { invalidateCardCache } from '../utils';

/**
 * Create a new card
 */
export async function createCard(
  db: PrismaClient,
  data: CreateCardData
): Promise<CardWithRelations> {
  // Validate data first
  const validation = CardValidator.validateCreateData(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Create the card
  const card = (await db.card.create({
    data: {
      ...data,
      keywords: data.keywords || [],
      tags: data.tags || [],
      language: data.language || 'en',
    },
    include: {
      type: true,
      rarity: true,
      set: true,
      rulings: true,
    },
  })) as CardWithRelations;

  // Invalidate related cache entries
  await invalidateCardCache(card);

  return card;
}

/**
 * Update an existing card
 */
export async function updateCard(
  db: PrismaClient,
  data: UpdateCardData
): Promise<CardWithRelations> {
  // Validate data first
  const validation = CardValidator.validateUpdateData(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  const { id, ...updateData } = data;

  // Get the existing card to know which cache entries to invalidate
  const existingCard = await db.card.findUnique({
    where: { id },
    select: {
      typeId: true,
      rarityId: true,
      setId: true,
      faction: true,
      series: true,
      nation: true,
    },
  });

  // Update the card
  const card = (await db.card.update({
    where: { id },
    data: updateData,
    include: {
      type: true,
      rarity: true,
      set: true,
      rulings: true,
    },
  })) as CardWithRelations;

  // Invalidate cache entries for both old and new values
  if (existingCard) {
    await invalidateCardCache(existingCard);
  }
  await invalidateCardCache(card);

  return card;
}

/**
 * Delete a card
 */
export async function deleteCard(
  db: PrismaClient,
  id: string
): Promise<boolean> {
  try {
    // Get the card details before deleting to invalidate cache
    const cardToDelete = await db.card.findUnique({
      where: { id },
      select: {
        typeId: true,
        rarityId: true,
        setId: true,
        faction: true,
        series: true,
        nation: true,
      },
    });

    await db.card.delete({
      where: { id },
    });

    // Invalidate cache entries
    if (cardToDelete) {
      await invalidateCardCache(cardToDelete);
    }

    return true;
  } catch {
    return false;
  }
}
