/**
 * API functions for the admin card editor.
 */

import type {
  AdminCard,
  AdminGame,
  CardFormState,
  PaginationData,
  ReferenceData,
} from './types';

export async function fetchGames(): Promise<AdminGame[]> {
  const res = await fetch('/api/admin/games');
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to load games');
  }
  return data.games as AdminGame[];
}

export async function fetchReferenceData(
  gameSlug: string
): Promise<ReferenceData> {
  const qs = `?gameSlug=${encodeURIComponent(gameSlug)}`;
  const [typesRes, raritiesRes, setsRes] = await Promise.all([
    fetch(`/api/reference/types${qs}`),
    fetch(`/api/reference/rarities${qs}`),
    fetch(`/api/reference/sets${qs}`),
  ]);
  const [types, rarities, sets] = await Promise.all([
    typesRes.json(),
    raritiesRes.json(),
    setsRes.json(),
  ]);
  return {
    types: types.types || [],
    rarities: rarities.rarities || [],
    sets: sets.sets || [],
  };
}

export async function fetchCards(
  gameSlug: string,
  search: string,
  page: number
): Promise<{ cards: AdminCard[]; pagination: PaginationData }> {
  const params = new URLSearchParams({
    gameSlug,
    page: String(page),
    limit: '30',
  });
  if (search) params.set('search', search);

  const res = await fetch(`/api/cards?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load cards');
  }
  // GET /api/cards responds with { cards, pagination: { page, total,
  // totalPages, hasNext, hasPrev }, filters } (see formatCardsResponse).
  return {
    cards: data.cards || [],
    pagination: {
      currentPage: data.pagination?.page ?? page,
      totalPages: data.pagination?.totalPages ?? 1,
      totalCount: data.pagination?.total ?? 0,
      hasMore: data.pagination?.hasNext ?? false,
    },
  };
}

export interface UploadedImage {
  imageUrl: string;
  imageUrlSmall: string;
  imageUrlLarge: string;
}

export async function uploadCardImage(file: File): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/upload/card-image', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || data.error || 'Upload failed');
  }
  return data.data as UploadedImage;
}

function parseList(input: string): string[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Build the API payload from form state. Core values map to flat Card
 *  columns; custom values map to the gameAttributes JSONB. */
export function buildCardPayload(form: CardFormState) {
  const customEntries = Object.entries(form.customValues).filter(
    ([, v]) => v !== null && v !== ''
  );

  return {
    name: form.name.trim(),
    typeId: form.typeId,
    rarityId: form.rarityId,
    setId: form.setId,
    setNumber: form.setNumber.trim(),
    imageUrl: form.imageUrl,
    imageUrlSmall: form.imageUrlSmall || undefined,
    imageUrlLarge: form.imageUrlLarge || undefined,
    description: form.description.trim() || undefined,
    officialText: form.officialText.trim() || undefined,
    ...form.coreValues,
    gameAttributes: Object.fromEntries(customEntries),
    keywords: parseList(form.keywordsInput),
    tags: parseList(form.tagsInput),
    isFoil: form.isFoil,
    isPromo: form.isPromo,
    isAlternate: form.isAlternate,
    language: form.language || 'en',
  };
}

export async function saveCard(
  gameSlug: string,
  form: CardFormState,
  cardId?: string
): Promise<AdminCard> {
  const qs = `?gameSlug=${encodeURIComponent(gameSlug)}`;
  const url = cardId ? `/api/cards/${cardId}${qs}` : `/api/cards${qs}`;

  const res = await fetch(url, {
    method: cardId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildCardPayload(form)),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Failed to save card');
  }
  return data.card as AdminCard;
}

export async function deleteCard(
  gameSlug: string,
  cardId: string
): Promise<void> {
  const res = await fetch(
    `/api/cards/${cardId}?gameSlug=${encodeURIComponent(gameSlug)}`,
    { method: 'DELETE' }
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.error || 'Failed to delete card');
  }
}
