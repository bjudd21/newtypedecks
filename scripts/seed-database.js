#!/usr/bin/env node

/**
 * Database Seeding Script
 *
 * This script seeds the database with initial data for development and testing.
 * It creates sample cards, sets, rarities, and other essential data.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sample data for seeding
const sampleData = {
  cardTypes: [
    {
      id: 'type-mobile-suit',
      name: 'Mobile Suit',
      description: 'Main battle units',
    },
    {
      id: 'type-character',
      name: 'Character',
      description: 'Pilot and crew cards',
    },
    {
      id: 'type-command',
      name: 'Command',
      description: 'Tactical command cards',
    },
    { id: 'type-event', name: 'Event', description: 'Special event cards' },
    {
      id: 'type-upgrade',
      name: 'Upgrade',
      description: 'Equipment and upgrades',
    },
  ],

  rarities: [
    {
      id: 'rarity-common',
      name: 'Common',
      color: '#9CA3AF',
      description: 'Most common cards',
    },
    {
      id: 'rarity-uncommon',
      name: 'Uncommon',
      color: '#3B82F6',
      description: 'Less common cards',
    },
    {
      id: 'rarity-rare',
      name: 'Rare',
      color: '#8B5CF6',
      description: 'Rare cards',
    },
    {
      id: 'rarity-epic',
      name: 'Epic',
      color: '#F59E0B',
      description: 'Very rare cards',
    },
    {
      id: 'rarity-legendary',
      name: 'Legendary',
      color: '#EF4444',
      description: 'Extremely rare cards',
    },
  ],

  sets: [
    {
      id: 'set-01',
      name: 'Awakening of the New Era',
      code: 'ST01',
      releaseDate: new Date('2024-01-01'),
      description: 'The first set introducing the Gundam Card Game',
    },
    {
      id: 'set-02',
      name: 'Mobile Suit Gundam',
      code: 'ST02',
      releaseDate: new Date('2024-02-01'),
      description: 'Classic Mobile Suit Gundam cards',
    },
  ],

  cards: [
    {
      id: 'card-001',
      name: 'RX-78-2 Gundam',
      level: 3,
      cost: 2,
      typeId: 'type-mobile-suit',
      rarityId: 'rarity-rare',
      setId: 'set-01',
      setNumber: 'ST01-001',
      imageUrl: '/images/cards/ST01-001.jpg',
      imageUrlSmall: '/images/cards/ST01-001_small.jpg',
      imageUrlLarge: '/images/cards/ST01-001_large.jpg',
      description: 'The legendary RX-78-2 Gundam, piloted by Amuro Ray.',
      officialText: 'When this unit is deployed, draw 1 card.',
    },
    {
      id: 'card-002',
      name: 'Amuro Ray',
      level: 2,
      cost: 1,
      typeId: 'type-character',
      rarityId: 'rarity-uncommon',
      setId: 'set-01',
      setNumber: 'ST01-002',
      imageUrl: '/images/cards/ST01-002.jpg',
      imageUrlSmall: '/images/cards/ST01-002_small.jpg',
      imageUrlLarge: '/images/cards/ST01-002_large.jpg',
      description: 'The legendary Newtype pilot of the RX-78-2 Gundam.',
      officialText: 'Newtype abilities provide tactical advantages.',
    },
    {
      id: 'card-003',
      name: 'Char Aznable',
      level: 2,
      cost: 1,
      typeId: 'type-character',
      rarityId: 'rarity-uncommon',
      setId: 'set-01',
      setNumber: 'ST01-003',
      imageUrl: '/images/cards/ST01-003.jpg',
      imageUrlSmall: '/images/cards/ST01-003_small.jpg',
      imageUrlLarge: '/images/cards/ST01-003_large.jpg',
      description: 'The Red Comet, Char Aznable.',
      officialText: "Char's tactical genius provides strategic advantages.",
    },
  ],
};

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log('🧹 Clearing existing data...');
    await prisma.collectionCard.deleteMany();
    await prisma.collection.deleteMany();
    await prisma.deckCard.deleteMany();
    await prisma.deck.deleteMany();
    await prisma.card.deleteMany();
    await prisma.set.deleteMany();
    await prisma.rarity.deleteMany();
    await prisma.cardType.deleteMany();
    await prisma.user.deleteMany();

    // Seed card types
    console.log('📋 Seeding card types...');
    for (const cardType of sampleData.cardTypes) {
      await prisma.cardType.create({ data: cardType });
    }

    // Seed rarities
    console.log('💎 Seeding rarities...');
    for (const rarity of sampleData.rarities) {
      await prisma.rarity.create({ data: rarity });
    }

    // Seed sets
    console.log('📦 Seeding sets...');
    for (const set of sampleData.sets) {
      await prisma.set.create({ data: set });
    }

    // Seed cards
    console.log('🃏 Seeding cards...');
    for (const card of sampleData.cards) {
      await prisma.card.create({ data: card });
    }

    // Create a sample user
    console.log('👤 Creating sample user...');
    const sampleUser = await prisma.user.create({
      data: {
        id: 'user-sample',
        email: 'sample@gundam-card-game.com',
        name: 'Sample User',
        role: 'USER',
      },
    });

    // Create a sample collection
    console.log('📚 Creating sample collection...');
    const sampleCollection = await prisma.collection.create({
      data: {
        userId: sampleUser.id,
      },
    });

    // Add some cards to the collection
    console.log('🎯 Adding cards to sample collection...');
    for (const card of sampleData.cards) {
      await prisma.collectionCard.create({
        data: {
          collectionId: sampleCollection.id,
          cardId: card.id,
          quantity: Math.floor(Math.random() * 3) + 1, // Random quantity 1-3
        },
      });
    }

    // Create a sample deck
    console.log('🎴 Creating sample deck...');
    const sampleDeck = await prisma.deck.create({
      data: {
        name: 'Sample Gundam Deck',
        description: 'A sample deck featuring classic Gundam cards',
        isPublic: true,
        userId: sampleUser.id,
      },
    });

    // Add cards to the deck
    console.log('🃏 Adding cards to sample deck...');
    for (const card of sampleData.cards) {
      await prisma.deckCard.create({
        data: {
          deckId: sampleDeck.id,
          cardId: card.id,
          quantity: Math.floor(Math.random() * 2) + 1, // Random quantity 1-2
        },
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${sampleData.cardTypes.length} card types`);
    console.log(`   - ${sampleData.rarities.length} rarities`);
    console.log(`   - ${sampleData.sets.length} sets`);
    console.log(`   - ${sampleData.cards.length} cards`);
    console.log(`   - 1 sample user`);
    console.log(`   - 1 sample collection`);
    console.log(`   - 1 sample deck`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleData };
