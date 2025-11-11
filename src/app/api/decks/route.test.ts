/**
 * Tests for Deck CRUD API Routes
 * Tests deck creation, listing, and management operations
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/database';

// Mock dependencies
jest.mock('next-auth/next');
jest.mock('@/lib/database', () => ({
  prisma: {
    deck: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    card: {
      findMany: jest.fn(),
    },
  },
}));
jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

describe('Deck API Routes', () => {
  const mockUserId = 'user-123';
  const mockSession = {
    user: {
      id: mockUserId,
      email: 'test@example.com',
      name: 'Test User',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe('GET /api/decks - List User Decks', () => {
    describe('Authentication', () => {
      it('should require authentication', async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest('http://localhost:3000/api/decks');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Authentication required');
      });

      it('should allow authenticated user to list their decks', async () => {
        (prisma.deck.findMany as jest.Mock).mockResolvedValue([]);
        (prisma.deck.count as jest.Mock).mockResolvedValue(0);

        const request = new NextRequest('http://localhost:3000/api/decks');
        const response = await GET(request);

        expect(response.status).toBe(200);
      });
    });

    describe('Pagination', () => {
      it('should return decks with default pagination', async () => {
        const mockDecks = [
          {
            id: 'deck-1',
            name: 'Test Deck',
            description: 'A test deck',
            isPublic: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            cards: [],
            _count: { cards: 0 },
          },
        ];

        (prisma.deck.findMany as jest.Mock).mockResolvedValue(mockDecks);
        (prisma.deck.count as jest.Mock).mockResolvedValue(1);

        const request = new NextRequest('http://localhost:3000/api/decks');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.pagination).toEqual({
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        });
      });

      it('should support custom page and limit', async () => {
        (prisma.deck.findMany as jest.Mock).mockResolvedValue([]);
        (prisma.deck.count as jest.Mock).mockResolvedValue(50);

        const request = new NextRequest(
          'http://localhost:3000/api/decks?page=2&limit=20'
        );
        const response = await GET(request);
        const data = await response.json();

        expect(data.pagination).toEqual({
          page: 2,
          limit: 20,
          total: 50,
          pages: 3,
        });
        expect(prisma.deck.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            skip: 20, // (page 2 - 1) * 20
            take: 20,
          })
        );
      });
    });

    describe('Search and Filtering', () => {
      it('should filter decks by search query', async () => {
        (prisma.deck.findMany as jest.Mock).mockResolvedValue([]);
        (prisma.deck.count as jest.Mock).mockResolvedValue(0);

        const request = new NextRequest(
          'http://localhost:3000/api/decks?search=gundam'
        );
        await GET(request);

        expect(prisma.deck.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              OR: [
                { name: { contains: 'gundam', mode: 'insensitive' } },
                { description: { contains: 'gundam', mode: 'insensitive' } },
              ],
            }),
          })
        );
      });

      it('should filter by public/private status', async () => {
        (prisma.deck.findMany as jest.Mock).mockResolvedValue([]);
        (prisma.deck.count as jest.Mock).mockResolvedValue(0);

        const request = new NextRequest(
          'http://localhost:3000/api/decks?public=true'
        );
        await GET(request);

        expect(prisma.deck.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              isPublic: true,
            }),
          })
        );
      });

      it('should only show current user decks', async () => {
        (prisma.deck.findMany as jest.Mock).mockResolvedValue([]);
        (prisma.deck.count as jest.Mock).mockResolvedValue(0);

        const request = new NextRequest('http://localhost:3000/api/decks');
        await GET(request);

        expect(prisma.deck.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              userId: mockUserId,
            }),
          })
        );
      });
    });

    describe('Deck Statistics', () => {
      it('should calculate deck statistics correctly', async () => {
        const mockDecks = [
          {
            id: 'deck-1',
            name: 'Test Deck',
            description: 'A test deck',
            isPublic: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            cards: [
              {
                quantity: 2,
                card: {
                  id: 'card-1',
                  cost: 3,
                  faction: 'Blue',
                },
              },
              {
                quantity: 1,
                card: {
                  id: 'card-2',
                  cost: 5,
                  faction: 'Red',
                },
              },
            ],
            _count: { cards: 2 },
          },
        ];

        (prisma.deck.findMany as jest.Mock).mockResolvedValue(mockDecks);
        (prisma.deck.count as jest.Mock).mockResolvedValue(1);

        const request = new NextRequest('http://localhost:3000/api/decks');
        const response = await GET(request);
        const data = await response.json();

        expect(data.decks[0]).toMatchObject({
          cardCount: 3, // 2 + 1
          uniqueCards: 2,
          totalCost: 11, // (3 * 2) + (5 * 1)
          colors: ['Blue', 'Red'],
        });
      });

      it('should handle decks with no cards', async () => {
        const mockDecks = [
          {
            id: 'deck-1',
            name: 'Empty Deck',
            description: '',
            isPublic: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            cards: [],
            _count: { cards: 0 },
          },
        ];

        (prisma.deck.findMany as jest.Mock).mockResolvedValue(mockDecks);
        (prisma.deck.count as jest.Mock).mockResolvedValue(1);

        const request = new NextRequest('http://localhost:3000/api/decks');
        const response = await GET(request);
        const data = await response.json();

        expect(data.decks[0]).toMatchObject({
          cardCount: 0,
          uniqueCards: 0,
          totalCost: 0,
          colors: [],
        });
      });
    });

    describe('Error Handling', () => {
      it('should handle database errors gracefully', async () => {
        (prisma.deck.findMany as jest.Mock).mockRejectedValue(
          new Error('Database error')
        );

        const request = new NextRequest('http://localhost:3000/api/decks');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Internal server error');
      });
    });
  });

  describe('POST /api/decks - Create Deck', () => {
    const validDeckData = {
      name: 'My Gundam Deck',
      description: 'A powerful deck',
      isPublic: false,
      cards: [
        { cardId: 'card-1', quantity: 2, category: 'main' },
        { cardId: 'card-2', quantity: 1, category: 'main' },
      ],
    };

    describe('Authentication', () => {
      it('should require authentication', async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify(validDeckData),
        });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Authentication required');
      });
    });

    describe('Validation', () => {
      it('should reject deck without name', async () => {
        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify({
            cards: validDeckData.cards,
          }),
        });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Name and cards are required');
      });

      it('should reject deck without cards', async () => {
        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Test Deck',
          }),
        });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Name and cards are required');
      });

      it('should reject deck with non-array cards', async () => {
        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Test Deck',
            cards: 'not-an-array',
          }),
        });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Name and cards are required');
      });

      it('should reject deck name that is empty (caught by required check)', async () => {
        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify({
            name: '',
            cards: validDeckData.cards,
          }),
        });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Name and cards are required');
      });

      it('should reject deck name that is too long', async () => {
        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify({
            name: 'A'.repeat(101),
            cards: validDeckData.cards,
          }),
        });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe(
          'Deck name must be between 1 and 100 characters'
        );
      });

      it('should reject deck with no cards', async () => {
        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Empty Deck',
            cards: [],
          }),
        });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Deck must contain at least one card');
      });
    });

    describe('Card Validation', () => {
      it('should validate that all cards exist in database', async () => {
        (prisma.card.findMany as jest.Mock).mockResolvedValue([
          { id: 'card-1' },
          { id: 'card-2' },
        ]);

        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify(validDeckData),
        });

        await POST(request);

        expect(prisma.card.findMany).toHaveBeenCalledWith({
          where: { id: { in: ['card-1', 'card-2'] } },
          select: { id: true },
        });
      });

      it('should reject deck with non-existent cards', async () => {
        // Only 1 card found when 2 expected
        (prisma.card.findMany as jest.Mock).mockResolvedValue([
          { id: 'card-1' },
        ]);

        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify(validDeckData),
        });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Some cards in the deck do not exist');
      });

      it('should handle cards with nested card.id structure', async () => {
        (prisma.card.findMany as jest.Mock).mockResolvedValue([
          { id: 'card-1' },
        ]);

        const deckWithNestedCards = {
          name: 'Test Deck',
          cards: [{ card: { id: 'card-1' }, quantity: 2 }],
        };

        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify(deckWithNestedCards),
        });

        await POST(request);

        expect(prisma.card.findMany).toHaveBeenCalledWith({
          where: { id: { in: ['card-1'] } },
          select: { id: true },
        });
      });
    });

    describe('Deck Creation', () => {
      it('should create deck with valid data', async () => {
        const mockCreatedDeck = {
          id: 'deck-123',
          name: validDeckData.name,
          description: validDeckData.description,
          isPublic: false,
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
          cards: [],
        };

        (prisma.card.findMany as jest.Mock).mockResolvedValue([
          { id: 'card-1' },
          { id: 'card-2' },
        ]);
        (prisma.deck.create as jest.Mock).mockResolvedValue(mockCreatedDeck);

        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify(validDeckData),
        });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.message).toBe('Deck created successfully');
        expect(data.deck).toBeDefined();
        expect(prisma.deck.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              name: validDeckData.name,
              description: validDeckData.description,
              isPublic: false,
              userId: mockUserId,
            }),
          })
        );
      });

      it('should default description to empty string if not provided', async () => {
        (prisma.card.findMany as jest.Mock).mockResolvedValue([
          { id: 'card-1' },
        ]);
        (prisma.deck.create as jest.Mock).mockResolvedValue({
          id: 'deck-123',
          name: 'Test Deck',
          description: '',
          isPublic: false,
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
          cards: [],
        });

        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Test Deck',
            cards: [{ cardId: 'card-1', quantity: 1 }],
          }),
        });
        await POST(request);

        expect(prisma.deck.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              description: '',
            }),
          })
        );
      });

      it('should enforce quantity limits (1-4 per card)', async () => {
        (prisma.card.findMany as jest.Mock).mockResolvedValue([
          { id: 'card-1' },
        ]);
        (prisma.deck.create as jest.Mock).mockResolvedValue({
          id: 'deck-123',
          name: 'Test Deck',
          description: '',
          isPublic: false,
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
          cards: [],
        });

        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Test Deck',
            cards: [
              { cardId: 'card-1', quantity: 10 }, // Should be capped at 4
            ],
          }),
        });
        await POST(request);

        // Check that quantity was capped
        const createCall = (prisma.deck.create as jest.Mock).mock.calls[0][0];
        const cardsData = createCall.data.cards.create;
        expect(cardsData[0].quantity).toBe(4); // Capped at max
      });

      it('should set default category to "main" if not provided', async () => {
        (prisma.card.findMany as jest.Mock).mockResolvedValue([
          { id: 'card-1' },
        ]);
        (prisma.deck.create as jest.Mock).mockResolvedValue({
          id: 'deck-123',
          name: 'Test Deck',
          description: '',
          isPublic: false,
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
          cards: [],
        });

        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Test Deck',
            cards: [{ cardId: 'card-1', quantity: 1 }],
          }),
        });
        await POST(request);

        const createCall = (prisma.deck.create as jest.Mock).mock.calls[0][0];
        const cardsData = createCall.data.cards.create;
        expect(cardsData[0].category).toBe('main');
      });
    });

    describe('Error Handling', () => {
      it('should handle invalid JSON gracefully', async () => {
        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: 'invalid json{',
        });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Internal server error');
      });

      it('should handle database errors during card validation', async () => {
        (prisma.card.findMany as jest.Mock).mockRejectedValue(
          new Error('Database error')
        );

        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify(validDeckData),
        });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Internal server error');
      });

      it('should handle database errors during deck creation', async () => {
        (prisma.card.findMany as jest.Mock).mockResolvedValue([
          { id: 'card-1' },
          { id: 'card-2' },
        ]);
        (prisma.deck.create as jest.Mock).mockRejectedValue(
          new Error('Database error')
        );

        const request = new NextRequest('http://localhost:3000/api/decks', {
          method: 'POST',
          body: JSON.stringify(validDeckData),
        });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Internal server error');
      });
    });
  });
});
