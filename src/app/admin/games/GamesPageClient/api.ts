/**
 * API utilities for admin games management
 */

import type { AdminGame, GameFormData } from './types';

export async function loadGames(): Promise<AdminGame[]> {
  const response = await fetch('/api/admin/games');
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to load games');
  return data.games as AdminGame[];
}

export async function createGame(form: GameFormData): Promise<AdminGame> {
  const response = await fetch('/api/admin/games', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: form.slug,
      name: form.name,
      shortName: form.shortName || null,
      publisher: form.publisher || null,
      isActive: form.isActive,
      sortOrder: form.sortOrder,
      config: JSON.parse(form.configJson),
    }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to create game');
  return data.game as AdminGame;
}

export async function updateGame(
  id: string,
  form: GameFormData
): Promise<AdminGame> {
  const response = await fetch(`/api/admin/games/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.name,
      shortName: form.shortName || null,
      publisher: form.publisher || null,
      isActive: form.isActive,
      sortOrder: form.sortOrder,
      config: JSON.parse(form.configJson),
    }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to update game');
  return data.game as AdminGame;
}

export async function toggleGameActive(
  id: string,
  isActive: boolean
): Promise<void> {
  const response = await fetch(`/api/admin/games/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to update game');
}
