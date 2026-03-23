#!/usr/bin/env node

/**
 * Game Records Seeder
 *
 * Idempotent — safe to run multiple times. Uses upsert on slug.
 * Seeds the Game table with Gundam Card Game and One Piece TCG records.
 *
 * Usage: npm run db:seed:games
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const games = [
  {
    slug: 'gundam',
    name: 'Gundam Card Game',
    shortName: 'Gundam',
    publisher: 'Bandai Namco Entertainment',
    copyrightHolder: 'Bandai Namco Entertainment Inc.',
    primaryColor: '#0066CC',
    secondaryColor: '#CC0000',
    accentColor: '#FFD700',
    isActive: true,
    sortOrder: 0,
    config: {
      cardSchema: {
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'cost', label: 'Cost', type: 'number', required: false },
          { key: 'level', label: 'Level', type: 'number', required: false },
          { key: 'clashPoints', label: 'CP', type: 'number', required: false },
          { key: 'hitPoints', label: 'HP', type: 'number', required: false },
          { key: 'attackPoints', label: 'AP', type: 'number', required: false },
        ],
        customFields: [
          { key: 'faction', label: 'Faction', type: 'text' },
          { key: 'pilot', label: 'Pilot', type: 'text' },
          { key: 'model', label: 'Model', type: 'text' },
          { key: 'series', label: 'Series', type: 'text' },
          { key: 'nation', label: 'Nation', type: 'text' },
        ],
      },
      deckRules: {
        minDeckSize: 50,
        maxDeckSize: 50,
        maxCopiesPerCard: 3,
        zones: [{ key: 'main', label: 'Main Deck', required: true }],
        specialRules: [],
      },
      cardTypes: ['Mobile Suit', 'Character', 'Command', 'Event', 'Upgrade'],
      rarities: ['Common', 'Uncommon', 'Rare', 'Super Rare', 'Secret Rare'],
      importFormats: ['text', 'csv', 'json'],
      exportFormats: ['text', 'csv', 'json'],
      legalDisclaimer:
        'Gundam Card Game © Bandai Namco Entertainment Inc. All Rights Reserved. This website is not affiliated with or endorsed by Bandai Namco Entertainment Inc.',
      copyrightNotice: '© Bandai Namco Entertainment Inc.',
      nonAffiliationStatement:
        'This website is not affiliated with or endorsed by Bandai Namco Entertainment Inc.',
      keywords: ['Mobile Suit', 'Newtype', 'Ace Pilot', 'Beam', 'Minovsky'],
    },
  },
  {
    slug: 'one-piece',
    name: 'One Piece Card Game',
    shortName: 'One Piece',
    publisher: 'Bandai Namco Entertainment',
    copyrightHolder: 'Eiichiro Oda / Shueisha, Toei Animation',
    primaryColor: '#D62828',
    secondaryColor: '#F7B731',
    accentColor: '#1565C0',
    isActive: true,
    sortOrder: 1,
    config: {
      cardSchema: {
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'cost', label: 'Cost', type: 'number', required: true },
        ],
        customFields: [
          {
            key: 'color',
            label: 'Color',
            type: 'select',
            options: [
              'Red',
              'Blue',
              'Green',
              'Purple',
              'Black',
              'Yellow',
              'Multi',
            ],
          },
          { key: 'power', label: 'Power', type: 'number' },
          { key: 'counter', label: 'Counter', type: 'number' },
          { key: 'life', label: 'Life', type: 'number' },
          {
            key: 'attribute',
            label: 'Attribute',
            type: 'select',
            options: ['Slash', 'Strike', 'Ranged', 'Special', 'Wisdom'],
          },
          { key: 'trait', label: 'Trait', type: 'text' },
          { key: 'don', label: 'DON!!', type: 'number' },
        ],
      },
      deckRules: {
        minDeckSize: 50,
        maxDeckSize: 50,
        maxCopiesPerCard: 4,
        zones: [
          { key: 'leader', label: 'Leader', required: true, maxSize: 1 },
          {
            key: 'main',
            label: 'Main Deck',
            required: true,
            minSize: 50,
            maxSize: 50,
          },
          {
            key: 'don',
            label: 'DON!! Deck',
            required: true,
            maxSize: 10,
            autoManaged: true,
          },
        ],
        specialRules: [],
      },
      cardTypes: ['Leader', 'Character', 'Event', 'Stage'],
      rarities: [
        'Common',
        'Uncommon',
        'Rare',
        'Super Rare',
        'Secret Rare',
        'Leader',
        'Promo',
      ],
      importFormats: ['text', 'csv', 'json'],
      exportFormats: ['text', 'csv', 'json'],
      legalDisclaimer:
        'ONE PIECE CARD GAME © Eiichiro Oda / Shueisha, Toei Animation. Licensed to Bandai Namco Entertainment Inc. This website is not affiliated with or endorsed by Bandai Namco Entertainment Inc., Eiichiro Oda, Shueisha, or Toei Animation.',
      copyrightNotice: '© Eiichiro Oda / Shueisha, Toei Animation',
      nonAffiliationStatement:
        'This website is not affiliated with or endorsed by Bandai Namco Entertainment Inc.',
      keywords: ['Straw Hat', 'Marine', 'Warlord', 'Emperor', 'Revolutionary'],
    },
  },
];

async function seedGames() {
  console.warn('Seeding game records...\n');

  for (const game of games) {
    const result = await prisma.game.upsert({
      where: { slug: game.slug },
      update: {
        name: game.name,
        shortName: game.shortName,
        publisher: game.publisher,
        copyrightHolder: game.copyrightHolder,
        primaryColor: game.primaryColor,
        secondaryColor: game.secondaryColor,
        accentColor: game.accentColor,
        config: game.config,
        isActive: game.isActive,
        sortOrder: game.sortOrder,
      },
      create: game,
    });

    console.warn(
      `  [OK] ${result.name} (slug: ${result.slug}, id: ${result.id})`
    );
  }

  console.warn('\nGame seeding complete.');
}

seedGames()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
