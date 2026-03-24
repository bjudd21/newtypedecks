/**
 * Deck-level type definitions
 */

/** A user-defined organizational bucket for deck cards. */
export interface DeckCategory {
  /** URL-safe slug, used as DeckCard.userCategory value. */
  key: string;
  /** Human-readable display name. */
  label: string;
  /** Display order (ascending). */
  sortOrder: number;
}

/** Parse a raw JSON value from Deck.categories into a typed array. */
export function parseDeckCategories(raw: unknown): DeckCategory[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is DeckCategory =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Record<string, unknown>).key === 'string' &&
      typeof (item as Record<string, unknown>).label === 'string' &&
      typeof (item as Record<string, unknown>).sortOrder === 'number'
  );
}

/** Generate a URL-safe key from a category label. */
export function slugifyCategory(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Build a default category list from a game's cardTypes array. */
export function defaultCategoriesFromCardTypes(
  cardTypes: string[]
): DeckCategory[] {
  return cardTypes.map((name, index) => ({
    key: slugifyCategory(name),
    label: name,
    sortOrder: index,
  }));
}
