/**
 * Card Operations for Collections
 *
 * Handles adding, updating, and removing cards from collections
 */

import { prisma } from '@/lib/database';

export type CardAction = 'add' | 'set' | 'remove';

export interface CardOperationResult {
  action: 'added' | 'updated' | 'removed';
  cardName?: string;
  collection?: unknown;
}

/**
 * Get or create a user's collection
 * @param userId - User ID
 * @returns User's collection
 */
export async function getOrCreateCollection(userId: string) {
  let userCollection = await prisma.collection.findUnique({
    where: { userId },
  });

  if (!userCollection) {
    userCollection = await prisma.collection.create({
      data: { userId },
    });
  }

  return userCollection;
}

/**
 * Handle adding a card to the collection
 * @param collectionId - Collection ID
 * @param cardId - Card ID
 * @param quantity - Quantity to add
 * @returns Operation result
 */
export async function addCardToCollection(
  collectionId: string,
  cardId: string,
  quantity: number
): Promise<CardOperationResult> {
  const newCollectionCard = await prisma.collectionCard.create({
    data: {
      collectionId,
      cardId,
      quantity,
    },
    include: {
      card: {
        include: {
          type: true,
          rarity: true,
        },
      },
    },
  });

  return { action: 'added', collection: newCollectionCard };
}

/**
 * Handle updating an existing card in the collection
 * @param existingCardId - Existing collection card ID
 * @param newQuantity - New quantity
 * @param cardName - Card name for removal message
 * @returns Operation result
 */
export async function updateCardInCollection(
  existingCardId: string,
  newQuantity: number,
  cardName: string
): Promise<CardOperationResult> {
  const finalQuantity = Math.max(0, newQuantity);

  if (finalQuantity === 0) {
    await prisma.collectionCard.delete({
      where: { id: existingCardId },
    });
    return { action: 'removed', cardName };
  }

  const updated = await prisma.collectionCard.update({
    where: { id: existingCardId },
    data: { quantity: finalQuantity },
    include: {
      card: {
        include: {
          type: true,
          rarity: true,
        },
      },
    },
  });

  return { action: 'updated', collection: updated };
}

/**
 * Handle removing a card from the collection
 * @param existingCardId - Existing collection card ID
 * @param cardName - Card name for confirmation message
 * @returns Operation result
 */
export async function removeCardFromCollection(
  existingCardId: string,
  cardName: string
): Promise<CardOperationResult> {
  await prisma.collectionCard.delete({
    where: { id: existingCardId },
  });

  return { action: 'removed', cardName };
}

/**
 * Process card operation based on action type
 * @param action - Action to perform (add, set, remove)
 * @param collectionId - Collection ID
 * @param cardId - Card ID
 * @param cardName - Card name
 * @param quantity - Quantity
 * @param existingCard - Existing collection card if present
 * @returns Operation result
 */
export async function processCardOperation(
  action: CardAction,
  collectionId: string,
  cardId: string,
  cardName: string,
  quantity: number,
  existingCard?: { id: string; quantity: number } | null
): Promise<CardOperationResult> {
  // Handle removal
  if (action === 'remove' || quantity === 0) {
    if (!existingCard) {
      throw new Error('Card not in collection');
    }
    return await removeCardFromCollection(existingCard.id, cardName);
  }

  // Handle update/set for existing card
  if (existingCard) {
    const newQuantity =
      action === 'set' ? quantity : existingCard.quantity + quantity;
    return await updateCardInCollection(existingCard.id, newQuantity, cardName);
  }

  // Handle new card addition
  if (quantity > 0) {
    return await addCardToCollection(collectionId, cardId, quantity);
  }

  throw new Error('Quantity must be greater than 0 to add cards');
}
