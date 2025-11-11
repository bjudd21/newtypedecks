/**
 * Tests for Individual Deck API Routes
 * Tests deck retrieval, update, and deletion operations
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from './route';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/database';

// Mock dependencies
jest.mock('next-auth/next');
jest.mock('@/lib/database', () => ({
  prisma: {
    deck: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    card: {
      findMany: jest.fn(),
    },
    deckCard: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    deckVersion: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));
jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

describe('Deck API Routes - Individual Deck Operations', () => {
  const mockUserId = 'user-123';
  const mockOtherUserId = 'user-456';
  const mockDeckId = 'deck-123';
  const mockSession = {
    user: {
      id: mockUserId,
      email: 'test@example.com',
      name: 'Test User',
    },
  };

  const mockDeck = {
    id: mockDeckId,
    name: 'Test Deck',
    description: 'Test description',
    isPublic: false,
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: mockUserId,
      name: 'Test User',
      email: 'test@example.com',
    },
    cards: [
      {
        cardId: 'card-1',
        quantity: 2,
        category: 'main',
        card: {
          id: 'card-1',
          name: 'Gundam Wing',
          cost: 3,
          faction: 'Blue',
          type: { id: 'type-1', name: 'Unit' },
          rarity: { id: 'rarity-1', name: 'Rare' },
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe('GET /api/decks/[id] - Get Single Deck', () => {
    const createMockRequest = () => ({
      params: Promise.resolve({ id: mockDeckId }),
    });

    describe('Access Control', () => {
      it('should allow owner to view private deck', async () => {
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue(mockDeck);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`
        );
        const response = await GET(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.id).toBe(mockDeckId);
      });

      it('should allow anyone to view public deck', async () => {
        const publicDeck = { ...mockDeck, isPublic: true };
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue(publicDeck);
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`
        );
        const response = await GET(request, createMockRequest());

        expect(response.status).toBe(200);
      });

      it('should deny access to private deck by non-owner', async () => {
        const privateDeck = {
          ...mockDeck,
          userId: mockOtherUserId,
          isPublic: false,
        };
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue(privateDeck);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`
        );
        const response = await GET(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe('Access denied');
      });

      it('should return 404 for non-existent deck', async () => {
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`
        );
        const response = await GET(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('Deck not found');
      });
    });

    describe('Statistics Calculation', () => {
      it('should calculate deck statistics correctly', async () => {
        const deckWithCards = {
          ...mockDeck,
          cards: [
            {
              cardId: 'card-1',
              quantity: 2,
              category: 'main',
              card: {
                id: 'card-1',
                cost: 3,
                faction: 'Blue',
                type: { id: 'type-1', name: 'Unit' },
                rarity: { id: 'rarity-1', name: 'Rare' },
              },
            },
            {
              cardId: 'card-2',
              quantity: 1,
              category: 'main',
              card: {
                id: 'card-2',
                cost: 5,
                faction: 'Red',
                type: { id: 'type-1', name: 'Unit' },
                rarity: { id: 'rarity-1', name: 'Rare' },
              },
            },
          ],
        };
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue(deckWithCards);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`
        );
        const response = await GET(request, createMockRequest());
        const data = await response.json();

        expect(data.statistics).toEqual({
          totalCards: 3, // 2 + 1
          uniqueCards: 2,
          totalCost: 11, // (3 * 2) + (5 * 1)
          averageCost: 3.67, // 11 / 3 rounded to 2 decimals
          colors: ['Blue', 'Red'],
        });
      });

      it('should handle empty decks correctly', async () => {
        const emptyDeck = { ...mockDeck, cards: [] };
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue(emptyDeck);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`
        );
        const response = await GET(request, createMockRequest());
        const data = await response.json();

        expect(data.statistics).toEqual({
          totalCards: 0,
          uniqueCards: 0,
          totalCost: 0,
          averageCost: 0,
          colors: [],
        });
      });
    });

    describe('Error Handling', () => {
      it('should handle database errors gracefully', async () => {
        (prisma.deck.findUnique as jest.Mock).mockRejectedValue(
          new Error('Database error')
        );

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`
        );
        const response = await GET(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Internal server error');
      });
    });
  });

  describe('PUT /api/decks/[id] - Update Deck', () => {
    const createMockRequest = () => ({
      params: Promise.resolve({ id: mockDeckId }),
    });

    describe('Authentication and Authorization', () => {
      it('should require authentication', async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ name: 'Updated Name' }),
          }
        );
        const response = await PUT(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Authentication required');
      });

      it('should require deck ownership', async () => {
        const otherUserDeck = {
          userId: mockOtherUserId,
          name: 'Other User Deck',
        };
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue(otherUserDeck);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ name: 'Updated Name' }),
          }
        );
        const response = await PUT(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe('Access denied');
      });

      it('should return 404 for non-existent deck', async () => {
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ name: 'Updated Name' }),
          }
        );
        const response = await PUT(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('Deck not found');
      });
    });

    describe('Validation', () => {
      beforeEach(() => {
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue({
          userId: mockUserId,
          name: 'Test Deck',
        });
      });

      it('should reject deck name that is too long', async () => {
        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ name: 'A'.repeat(101) }),
          }
        );
        const response = await PUT(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe(
          'Deck name must be between 1 and 100 characters'
        );
      });

      it('should reject empty card list', async () => {
        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ cards: [] }),
          }
        );
        const response = await PUT(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Deck must contain at least one card');
      });

      it('should validate that updated cards exist', async () => {
        (prisma.card.findMany as jest.Mock).mockResolvedValue([
          { id: 'card-1' },
        ]);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              cards: [
                { cardId: 'card-1', quantity: 1 },
                { cardId: 'card-2', quantity: 1 },
              ],
            }),
          }
        );
        const response = await PUT(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Some cards in the deck do not exist');
      });
    });

    describe('Metadata Update', () => {
      beforeEach(() => {
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue({
          userId: mockUserId,
          name: 'Test Deck',
        });
        (prisma.deck.update as jest.Mock).mockResolvedValue(mockDeck);
      });

      it('should update deck name', async () => {
        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ name: 'Updated Name' }),
          }
        );
        const response = await PUT(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toBe('Deck updated successfully');
        expect(prisma.deck.update).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { id: mockDeckId },
            data: expect.objectContaining({
              name: 'Updated Name',
            }),
          })
        );
      });

      it('should update deck description', async () => {
        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ description: 'New description' }),
          }
        );
        await PUT(request, createMockRequest());

        expect(prisma.deck.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              description: 'New description',
            }),
          })
        );
      });

      it('should update deck public status', async () => {
        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ isPublic: true }),
          }
        );
        await PUT(request, createMockRequest());

        expect(prisma.deck.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              isPublic: true,
            }),
          })
        );
      });
    });

    describe('Card List Update', () => {
      beforeEach(() => {
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue({
          userId: mockUserId,
          name: 'Test Deck',
        });
        (prisma.card.findMany as jest.Mock).mockResolvedValue([
          { id: 'card-1' },
          { id: 'card-2' },
        ]);
      });

      it('should update cards with versioning', async () => {
        const mockTransaction = jest.fn().mockImplementation(async (fn) => {
          const tx = {
            deck: {
              findUnique: jest.fn().mockResolvedValue({
                id: mockDeckId,
                name: 'Test Deck',
                cards: [{ cardId: 'old-card', quantity: 1, category: 'main' }],
              }),
              update: jest.fn().mockResolvedValue(mockDeck),
            },
            deckVersion: {
              findFirst: jest.fn().mockResolvedValue({ version: 1 }),
              create: jest.fn(),
            },
            deckCard: {
              deleteMany: jest.fn(),
              createMany: jest.fn(),
            },
          };
          return fn(tx);
        });

        (prisma.$transaction as jest.Mock).mockImplementation(mockTransaction);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              cards: [
                { cardId: 'card-1', quantity: 2 },
                { cardId: 'card-2', quantity: 1 },
              ],
            }),
          }
        );
        const response = await PUT(request, createMockRequest());

        expect(response.status).toBe(200);
        expect(prisma.$transaction).toHaveBeenCalled();
      });

      it('should enforce quantity limits on card updates', async () => {
        // Override card.findMany for this test to return only card-1
        (prisma.card.findMany as jest.Mock).mockResolvedValue([
          { id: 'card-1' },
        ]);

        // Track if quantity was capped
        let quantityWasCapped = false;

        const mockTransaction = jest.fn().mockImplementation(async (fn) => {
          const tx = {
            deck: {
              findUnique: jest.fn().mockResolvedValue({
                id: mockDeckId,
                name: 'Test Deck',
                cards: [],
              }),
              update: jest.fn().mockResolvedValue(mockDeck),
            },
            deckVersion: {
              findFirst: jest.fn().mockResolvedValue(null),
            },
            deckCard: {
              deleteMany: jest.fn(),
              createMany: jest.fn((data) => {
                // Check that quantity was capped
                const createdCards = data.data;
                if (createdCards[0].quantity === 4) {
                  quantityWasCapped = true;
                }
                return Promise.resolve();
              }),
            },
          };
          const result = await fn(tx);
          return result || mockDeck;
        });

        (prisma.$transaction as jest.Mock).mockImplementation(mockTransaction);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              cards: [{ cardId: 'card-1', quantity: 10 }], // Should be capped at 4
            }),
          }
        );
        const response = await PUT(request, createMockRequest());

        expect(response.status).toBe(200);
        expect(quantityWasCapped).toBe(true);
      });
    });

    describe('Error Handling', () => {
      it('should handle invalid JSON gracefully', async () => {
        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          {
            method: 'PUT',
            body: 'invalid json{',
          }
        );
        const response = await PUT(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Internal server error');
      });

      it('should handle database errors gracefully', async () => {
        (prisma.deck.findUnique as jest.Mock).mockRejectedValue(
          new Error('Database error')
        );

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          {
            method: 'PUT',
            body: JSON.stringify({ name: 'Updated Name' }),
          }
        );
        const response = await PUT(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Internal server error');
      });
    });
  });

  describe('DELETE /api/decks/[id] - Delete Deck', () => {
    const createMockRequest = () => ({
      params: Promise.resolve({ id: mockDeckId }),
    });

    describe('Authentication and Authorization', () => {
      it('should require authentication', async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          { method: 'DELETE' }
        );
        const response = await DELETE(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Authentication required');
      });

      it('should require deck ownership', async () => {
        const otherUserDeck = {
          userId: mockOtherUserId,
          name: 'Other User Deck',
        };
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue(otherUserDeck);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          { method: 'DELETE' }
        );
        const response = await DELETE(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(403);
        expect(data.error).toBe('Access denied');
      });

      it('should return 404 for non-existent deck', async () => {
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          { method: 'DELETE' }
        );
        const response = await DELETE(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('Deck not found');
      });
    });

    describe('Deletion', () => {
      it('should delete deck successfully', async () => {
        (prisma.deck.findUnique as jest.Mock).mockResolvedValue({
          userId: mockUserId,
          name: 'Test Deck',
        });
        (prisma.deck.delete as jest.Mock).mockResolvedValue({});

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          { method: 'DELETE' }
        );
        const response = await DELETE(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toBe('Deck deleted successfully');
        expect(data.deckName).toBe('Test Deck');
        expect(prisma.deck.delete).toHaveBeenCalledWith({
          where: { id: mockDeckId },
        });
      });
    });

    describe('Error Handling', () => {
      it('should handle database errors gracefully', async () => {
        (prisma.deck.findUnique as jest.Mock).mockRejectedValue(
          new Error('Database error')
        );

        const request = new NextRequest(
          `http://localhost:3000/api/decks/${mockDeckId}`,
          { method: 'DELETE' }
        );
        const response = await DELETE(request, createMockRequest());
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Internal server error');
      });
    });
  });
});
