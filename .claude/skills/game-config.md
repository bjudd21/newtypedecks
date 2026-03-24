# Newtype Decks — Multi-TCG Game Configuration Skill

## When to use

Apply when adding a new TCG game, modifying game configs, updating card schemas, changing deck rules, or seeding card data.

## Adding a New Game — Complete Checklist

### Step 1: Create the config file

Create `src/lib/config/games/{slug}.ts` following this exact structure:

```typescript
import type { GameConfig } from '../../types/game';

export const {SLUG_UPPER}_GAME_CONFIG: GameConfig = {
  cardSchema: {
    fields: [
      // Universal fields with per-game label overrides
      { key: 'cost', label: 'Cost', type: 'number', required: false,
        filterable: true, showInDetail: true, showInList: true, sortOrder: 1 },
    ],
    customFields: [
      // Game-specific fields stored in Card.gameAttributes JSONB
      { key: 'color', label: 'Color', type: 'multi_select', required: true,
        filterable: true, showInDetail: true, showInList: true, sortOrder: 1,
        options: ['Red', 'Blue', 'Green'] },
    ],
  },
  deckRules: {
    minDeckSize: 50,
    maxDeckSize: 60,
    maxCopiesPerCard: 4,
    startingHandSize: 5,
    zones: [
      { key: 'main', label: 'Main Deck', required: true, minSize: 50, maxSize: 60 },
      // Add leader, sideboard, extra deck zones as needed
    ],
    specialRules: [], // IDs of game-specific validation rules
  },
  cardTypes: ['Unit', 'Spell', 'Trap'],
  rarities: ['Common', 'Uncommon', 'Rare', 'Super Rare'],
  keywords: ['Rush', 'Guard', 'Counter'],
  importFormats: ['text', 'csv', 'json'],
  exportFormats: ['text', 'csv', 'json', 'decklist'],
  legalDisclaimer: '...full legal disclaimer...',
  copyrightNotice: '...short copyright line...',
  nonAffiliationStatement: '...non-affiliation text...',
};

export const {SLUG_UPPER}_GAME_SEED = {
  slug: '{slug}',
  name: '{Full Game Name}',
  shortName: '{Short Name}',
  publisher: '{Publisher}',
  copyrightHolder: '{Copyright Holder Inc.}',
  primaryColor: '#hexcolor',
  secondaryColor: '#1a1625',
  accentColor: '#hexcolor',
  config: {SLUG_UPPER}_GAME_CONFIG,
  isActive: true,
  sortOrder: 3, // increment from existing games
};
```

### Step 2: Register in the index

Add to `src/lib/config/games/index.ts`:

```typescript
export { {SLUG_UPPER}_GAME_CONFIG, {SLUG_UPPER}_GAME_SEED } from './{slug}';
```

### Step 3: Add to the seed script

Add the game data to `scripts/seed-games.js` in the GAMES array.

### Step 4: Seed the game

```bash
npm run db:seed:games
```

### Step 5: Seed card data

Create `scripts/seed-{slug}-cards.js` or add to the main seed script. Card data format:

```javascript
{
  name: 'Card Name',
  cost: 3,
  typeId: 'resolved-type-id',
  rarityId: 'resolved-rarity-id',
  setId: 'resolved-set-id',
  setNumber: 'SET-001',
  imageUrl: '/cards/{slug}/set-001.jpg',
  gameId: 'resolved-game-id',
  gameAttributes: {
    color: ['Red'],        // Game-specific
    power: 5000,           // Game-specific
    counter: '+1000',      // Game-specific
    trait: ['Straw Hat'],  // Game-specific
  },
  keywords: ['Rush', 'Counter'],
}
```

### Step 6: Verify

- `/{slug}/cards` shows the card database
- Card filters work with game-specific fields
- Deck builder enforces the game's rules
- Legal text shows the correct copyright

## Deck Rules Reference

### Zone types

| Property           | Type      | Description                                                    |
| ------------------ | --------- | -------------------------------------------------------------- |
| `key`              | string    | Unique zone ID (`main`, `sideboard`, `leader`, `don`, `extra`) |
| `label`            | string    | Display name                                                   |
| `required`         | boolean   | Must have cards for deck to be valid                           |
| `minSize`          | number?   | Minimum cards in zone                                          |
| `maxSize`          | number?   | Maximum cards in zone                                          |
| `exactSize`        | number?   | Exact cards required (overrides min/max)                       |
| `allowedCardTypes` | string[]? | Only these card types can go in this zone                      |

### Special rules (referenced by ID in `specialRules` array)

| Rule ID              | Description                                  | Used by   |
| -------------------- | -------------------------------------------- | --------- |
| `legendary-limit`    | Max 1 copy of legendary/secret rare cards    | Gundam    |
| `color-match-leader` | Main deck cards must match leader's color(s) | One Piece |

To add a new special rule: implement it in `src/lib/services/deckValidationService/validators/` and register the ID.

### Card field types

| Type           | Description      | Prisma JSONB query     |
| -------------- | ---------------- | ---------------------- |
| `text`         | Free text        | `string_contains`      |
| `number`       | Numeric          | `equals`, `gte`, `lte` |
| `select`       | Single choice    | `equals`               |
| `multi_select` | Multiple choices | `array_contains`       |
| `boolean`      | True/false       | `equals`               |
| `textarea`     | Long text        | `string_contains`      |

## Existing Game Configs

### Gundam Card Game (`slug: gundam`)

- Deck: 50-60 main + 15 sideboard
- Custom fields: faction, pilot, model, series
- Special rules: legendary-limit
- Starting hand: 6

### One Piece TCG (`slug: onepiece`)

- Deck: 1 leader + 50 main + 10 DON!!
- Custom fields: color, power, counter, life, attribute, trait
- Special rules: color-match-leader
- Starting hand: 5
