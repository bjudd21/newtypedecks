/**
 * API utilities for deck operations
 */

import type {
  Deck,
  CreateDeckData,
  UpdateDeckData,
  GetUserDecksOptions,
  GetUserDecksResponse,
} from './types';

/**
 * Build query parameters for getUserDecks
 */
export function buildQueryParams(options?: GetUserDecksOptions): string {
  const params = new URLSearchParams();
  if (options?.page) params.set('page', options.page.toString());
  if (options?.limit) params.set('limit', options.limit.toString());
  if (options?.search) params.set('search', options.search);
  if (options?.format) params.set('format', options.format);
  return params.toString();
}

/**
 * Create a new deck
 */
export async function apiCreateDeck(deckData: CreateDeckData): Promise<Deck> {
  const response = await fetch('/api/decks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deckData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to save deck');
  }

  return data.deck;
}

/**
 * Update an existing deck
 */
export async function apiUpdateDeck(
  deckId: string,
  updateData: UpdateDeckData
): Promise<Deck> {
  const response = await fetch(`/api/decks/${deckId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update deck');
  }

  return data.deck;
}

/**
 * Delete a deck
 */
export async function apiDeleteDeck(deckId: string): Promise<void> {
  const response = await fetch(`/api/decks/${deckId}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete deck');
  }
}

/**
 * Get a single deck by ID
 */
export async function apiGetDeck(deckId: string): Promise<Deck> {
  const response = await fetch(`/api/decks/${deckId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to load deck');
  }

  return data;
}

/**
 * Get user's decks with pagination and filters
 */
export async function apiGetUserDecks(
  options?: GetUserDecksOptions
): Promise<GetUserDecksResponse> {
  const queryString = buildQueryParams(options);
  const response = await fetch(`/api/decks?${queryString}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to load decks');
  }

  return data;
}
