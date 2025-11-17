/**
 * API utilities for card collection operations
 */

/**
 * Add card to collection
 */
export async function apiAddToCollection(
  cardId: string,
  quantity: number
): Promise<unknown> {
  const response = await fetch('/api/collection/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId, quantity }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to add card to collection: ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Remove card from collection
 */
export async function apiRemoveFromCollection(
  cardId: string,
  quantity: number
): Promise<unknown> {
  const response = await fetch('/api/collection/cards', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId, quantity }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to remove card from collection: ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Update card quantity in collection
 */
export async function apiUpdateQuantity(
  cardId: string,
  quantity: number
): Promise<unknown> {
  const response = await fetch('/api/collection/cards', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId, quantity }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update card quantity: ${response.statusText}`);
  }

  return await response.json();
}
