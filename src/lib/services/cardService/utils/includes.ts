/**
 * Include Clause Builders
 */

/**
 * Get standard include clause for card relations
 */
export function getCardInclude(includeRelations: boolean) {
  return includeRelations
    ? {
        type: true,
        rarity: true,
        set: true,
        rulings: true,
      }
    : undefined;
}
