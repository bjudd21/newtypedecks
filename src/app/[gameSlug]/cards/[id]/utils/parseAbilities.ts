/**
 * parseAbilities Utility
 * Parses abilities JSON string into structured ability objects
 */

export interface ParsedAbility {
  name: string;
  description: string;
  cost: string | null;
}

export function parseAbilities(abilities: string): ParsedAbility[] {
  try {
    const parsed = JSON.parse(abilities);
    return Array.isArray(parsed)
      ? parsed.map((ability: unknown, index: number) => {
          const abilityObj = ability as Record<string, unknown>;
          return {
            name: (abilityObj.name as string) || `Ability ${index + 1}`,
            description: (abilityObj.description as string) || String(ability),
            cost: abilityObj.cost != null ? String(abilityObj.cost) : null,
          };
        })
      : [
          {
            name: 'Ability',
            description:
              typeof parsed === 'string' ? parsed : JSON.stringify(parsed),
            cost: null,
          },
        ];
  } catch {
    return [{ name: 'Ability', description: abilities, cost: null }];
  }
}
