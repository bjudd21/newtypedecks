/**
 * Tests for User Collections API Routes
 * Tests collection listing, filtering, and add/update/remove operations
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
    collection: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    collectionCard: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    card: {
      count: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));
jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

describe('User Collections API Routes', () => {
  const mockUserId = 'user-123';
  const mockCollectionId = 'collection-123';
  const mockCardId = 'card-123';
  const mockSession = {
    user: {
      id: mockUserId,
      email: 'test@example.com',
      name: 'Test User',
    },
  };

  const mockCard = {
    id: mockCardId,
    name: 'Gundam Wing',
    cost: 3,
    faction: 'Blue',
    type: { id: 'type-1', name: 'Unit' },
    rarity: { id: 'rarity-1', name: 'Rare' },
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe('GET /api/collections - List User Collection', () => {
    beforeEach(() => {
      (prisma.collection.findUnique as jest.Mock).mockResolvedValue({
        id: mockCollectionId,
        userId: mockUserId,
      });
    });

    describe('Authentication', () => {
      it('should require authentication', async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest(
          'http://localhost:3000/api/collections'
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Authentication required');
      });
    });

    describe('Collection Auto-Creation', () => {
      it('should create collection if it does not exist', async () => {
        (prisma.collection.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.collection.create as jest.Mock).mockResolvedValue({
          id: mockCollectionId,
          userId: mockUserId,
        });
        (prisma.collectionCard.findMany as jest.Mock).mockResolvedValue([]);
        (prisma.collectionCard.count as jest.Mock).mockResolvedValue(0);
        (prisma.collectionCard.aggregate as jest.Mock).mockResolvedValue({
          _sum: { quantity: 0 },
          _count: { id: 0 },
        });
        (prisma.card.count as jest.Mock).mockResolvedValue(100);

        const request = new NextRequest(
          'http://localhost:3000/api/collections'
        );
        const response = await GET(request);

        expect(response.status).toBe(200);
        expect(prisma.collection.create).toHaveBeenCalledWith({
          data: { userId: mockUserId },
        });
      });
    });

    describe('Pagination', () => {
      beforeEach(() => {
        (prisma.collectionCard.findMany as jest.Mock).mockResolvedValue([]);
        (prisma.collectionCard.count as jest.Mock).mockResolvedValue(0);
        (prisma.collectionCard.aggregate as jest.Mock).mockResolvedValue({
          _sum: { quantity: 0 },
          _count: { id: 0 },
        });
        (prisma.card.count as jest.Mock).mockResolvedValue(100);
      });

      it('should return collection with default pagination', async () => {
        const request = new NextRequest(
          'http://localhost:3000/api/collections'
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.collection.pagination).toEqual({
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        });
      });

      it('should support custom page and limit', async () => {
        (prisma.collectionCard.count as jest.Mock).mockResolvedValue(50);

        const request = new NextRequest(
          'http://localhost:3000/api/collections?page=2&limit=10'
        );
        const response = await GET(request);
        const data = await response.json();

        expect(data.collection.pagination).toEqual({
          page: 2,
          limit: 10,
          total: 50,
          pages: 5,
        });
        expect(prisma.collectionCard.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            skip: 10, // (page 2 - 1) * 10
            take: 10,
          })
        );
      });
    });

    describe('Filtering', () => {
      beforeEach(() => {
        (prisma.collectionCard.findMany as jest.Mock).mockResolvedValue([]);
        (prisma.collectionCard.count as jest.Mock).mockResolvedValue(0);
        (prisma.collectionCard.aggregate as jest.Mock).mockResolvedValue({
          _sum: { quantity: 0 },
          _count: { id: 0 },
        });
        (prisma.card.count as jest.Mock).mockResolvedValue(100);
      });

      it('should filter by search query', async () => {
        const request = new NextRequest(
          'http://localhost:3000/api/collections?search=gundam'
        );
        await GET(request);

        expect(prisma.collectionCard.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              card: expect.objectContaining({
                OR: [
                  { name: { contains: 'gundam', mode: 'insensitive' } },
                  { description: { contains: 'gundam', mode: 'insensitive' } },
                ],
              }),
            }),
          })
        );
      });

      it('should filter by rarity', async () => {
        const request = new NextRequest(
          'http://localhost:3000/api/collections?rarity=Rare'
        );
        await GET(request);

        expect(prisma.collectionCard.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              card: expect.objectContaining({
                rarity: { is: { name: 'Rare' } },
              }),
            }),
          })
        );
      });

      it('should filter by type', async () => {
        const request = new NextRequest(
          'http://localhost:3000/api/collections?type=Unit'
        );
        await GET(request);

        expect(prisma.collectionCard.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              card: expect.objectContaining({
                type: { is: { name: 'Unit' } },
              }),
            }),
          })
        );
      });

      it('should filter by faction', async () => {
        const request = new NextRequest(
          'http://localhost:3000/api/collections?faction=Blue'
        );
        await GET(request);

        expect(prisma.collectionCard.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              card: expect.objectContaining({
                faction: 'Blue',
              }),
            }),
          })
        );
      });

      it('should support combined filters', async () => {
        const request = new NextRequest(
          'http://localhost:3000/api/collections?search=gundam&rarity=Rare&faction=Blue'
        );
        await GET(request);

        expect(prisma.collectionCard.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              card: expect.objectContaining({
                OR: expect.any(Array),
                rarity: { is: { name: 'Rare' } },
                faction: 'Blue',
              }),
            }),
          })
        );
      });
    });

    describe('Statistics', () => {
      it('should calculate collection statistics correctly', async () => {
        (prisma.collectionCard.findMany as jest.Mock).mockResolvedValue([]);
        (prisma.collectionCard.count as jest.Mock).mockResolvedValue(0);
        (prisma.collectionCard.aggregate as jest.Mock).mockResolvedValue({
          _sum: { quantity: 50 },
          _count: { id: 25 },
        });
        (prisma.card.count as jest.Mock).mockResolvedValue(100);

        const request = new NextRequest(
          'http://localhost:3000/api/collections'
        );
        const response = await GET(request);
        const data = await response.json();

        expect(data.collection.statistics).toEqual({
          totalCards: 50,
          uniqueCards: 25,
          completionPercentage: 25, // 25/100 = 25%
        });
      });

      it('should handle empty collections', async () => {
        (prisma.collectionCard.findMany as jest.Mock).mockResolvedValue([]);
        (prisma.collectionCard.count as jest.Mock).mockResolvedValue(0);
        (prisma.collectionCard.aggregate as jest.Mock).mockResolvedValue({
          _sum: { quantity: null },
          _count: { id: 0 },
        });
        (prisma.card.count as jest.Mock).mockResolvedValue(100);

        const request = new NextRequest(
          'http://localhost:3000/api/collections'
        );
        const response = await GET(request);
        const data = await response.json();

        expect(data.collection.statistics).toEqual({
          totalCards: 0,
          uniqueCards: 0,
          completionPercentage: 0,
        });
      });
    });

    describe('Error Handling', () => {
      it('should handle database errors gracefully', async () => {
        (prisma.collection.findUnique as jest.Mock).mockRejectedValue(
          new Error('Database error')
        );

        const request = new NextRequest(
          'http://localhost:3000/api/collections'
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Internal server error');
      });
    });
  });

  describe('POST /api/collections - Add/Update/Remove Cards', () => {
    const mockCollection = {
      id: mockCollectionId,
      userId: mockUserId,
    };

    beforeEach(() => {
      (prisma.collection.findUnique as jest.Mock).mockResolvedValue(
        mockCollection
      );
      (prisma.card.findUnique as jest.Mock).mockResolvedValue(mockCard);
    });

    describe('Authentication', () => {
      it('should require authentication', async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({ cardId: mockCardId, quantity: 1 }),
          }
        );
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Authentication required');
      });
    });

    describe('Validation', () => {
      it('should require cardId', async () => {
        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({ quantity: 1 }),
          }
        );
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Card ID is required');
      });

      it('should return 404 for non-existent card', async () => {
        (prisma.card.findUnique as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({ cardId: 'non-existent', quantity: 1 }),
          }
        );
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('Card not found');
      });

      it('should treat quantity 0 as 1 (due to default fallback)', async () => {
        // When quantity is 0, parseInt(0) || 1 results in 1
        (prisma.collectionCard.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.collectionCard.create as jest.Mock).mockResolvedValue({
          id: 'new-card',
          collectionId: mockCollectionId,
          cardId: mockCardId,
          quantity: 1,
          card: mockCard,
        });

        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({ cardId: mockCardId, quantity: 0 }),
          }
        );
        const response = await POST(request);

        expect(response.status).toBe(200);
        expect(prisma.collectionCard.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({ quantity: 1 }),
          })
        );
      });
    });

    describe('Adding New Cards', () => {
      it('should add new card to collection', async () => {
        (prisma.collectionCard.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.collectionCard.create as jest.Mock).mockResolvedValue({
          id: 'new-collection-card',
          collectionId: mockCollectionId,
          cardId: mockCardId,
          quantity: 2,
          card: mockCard,
        });

        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({ cardId: mockCardId, quantity: 2 }),
          }
        );
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toContain('added successfully');
        expect(prisma.collectionCard.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: {
              collectionId: mockCollectionId,
              cardId: mockCardId,
              quantity: 2,
            },
          })
        );
      });

      it('should default quantity to 1 if not provided', async () => {
        (prisma.collectionCard.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.collectionCard.create as jest.Mock).mockResolvedValue({
          id: 'new-collection-card',
          collectionId: mockCollectionId,
          cardId: mockCardId,
          quantity: 1,
          card: mockCard,
        });

        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({ cardId: mockCardId }),
          }
        );
        await POST(request);

        expect(prisma.collectionCard.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({ quantity: 1 }),
          })
        );
      });
    });

    describe('Updating Existing Cards', () => {
      const existingCollectionCard = {
        id: 'existing-card',
        collectionId: mockCollectionId,
        cardId: mockCardId,
        quantity: 3,
      };

      it('should add to existing quantity (default action)', async () => {
        (prisma.collectionCard.findUnique as jest.Mock).mockResolvedValue(
          existingCollectionCard
        );
        (prisma.collectionCard.update as jest.Mock).mockResolvedValue({
          ...existingCollectionCard,
          quantity: 5,
          card: mockCard,
        });

        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({ cardId: mockCardId, quantity: 2 }),
          }
        );
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toContain('updated successfully');
        expect(prisma.collectionCard.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: { quantity: 5 }, // 3 + 2
          })
        );
      });

      it('should set exact quantity when action is "set"', async () => {
        (prisma.collectionCard.findUnique as jest.Mock).mockResolvedValue(
          existingCollectionCard
        );
        (prisma.collectionCard.update as jest.Mock).mockResolvedValue({
          ...existingCollectionCard,
          quantity: 10,
          card: mockCard,
        });

        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({
              cardId: mockCardId,
              quantity: 10,
              action: 'set',
            }),
          }
        );
        await POST(request);

        expect(prisma.collectionCard.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: { quantity: 10 },
          })
        );
      });

      it('should remove card when updated quantity reaches 0', async () => {
        (prisma.collectionCard.findUnique as jest.Mock).mockResolvedValue(
          existingCollectionCard
        );
        (prisma.collectionCard.delete as jest.Mock).mockResolvedValue(
          existingCollectionCard
        );

        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({ cardId: mockCardId, quantity: -10 }), // Will result in 0
          }
        );
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toContain('removed successfully');
        expect(prisma.collectionCard.delete).toHaveBeenCalled();
      });
    });

    describe('Removing Cards', () => {
      const existingCollectionCard = {
        id: 'existing-card',
        collectionId: mockCollectionId,
        cardId: mockCardId,
        quantity: 3,
      };

      it('should remove card with action "remove"', async () => {
        (prisma.collectionCard.findUnique as jest.Mock).mockResolvedValue(
          existingCollectionCard
        );
        (prisma.collectionCard.delete as jest.Mock).mockResolvedValue(
          existingCollectionCard
        );

        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({ cardId: mockCardId, action: 'remove' }),
          }
        );
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toContain('removed successfully');
        expect(prisma.collectionCard.delete).toHaveBeenCalledWith({
          where: { id: existingCollectionCard.id },
        });
      });

      it('should add 1 to existing quantity when passing 0 (due to default fallback)', async () => {
        // When quantity is 0, parseInt(0) || 1 results in 1, so it adds 1
        (prisma.collectionCard.findUnique as jest.Mock).mockResolvedValue(
          existingCollectionCard
        );
        (prisma.collectionCard.update as jest.Mock).mockResolvedValue({
          ...existingCollectionCard,
          quantity: 4, // 3 + 1
          card: mockCard,
        });

        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({ cardId: mockCardId, quantity: 0 }),
          }
        );
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toContain('updated successfully');
        expect(prisma.collectionCard.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: { quantity: 4 }, // 3 + 1
          })
        );
      });

      it('should return 404 when removing card not in collection', async () => {
        (prisma.collectionCard.findUnique as jest.Mock).mockResolvedValue(null);

        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({ cardId: mockCardId, action: 'remove' }),
          }
        );
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('Card not in collection');
      });
    });

    describe('Collection Auto-Creation', () => {
      it('should create collection if it does not exist', async () => {
        (prisma.collection.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.collection.create as jest.Mock).mockResolvedValue(
          mockCollection
        );
        (prisma.collectionCard.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.collectionCard.create as jest.Mock).mockResolvedValue({
          id: 'new-card',
          collectionId: mockCollectionId,
          cardId: mockCardId,
          quantity: 1,
          card: mockCard,
        });

        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({ cardId: mockCardId, quantity: 1 }),
          }
        );
        const response = await POST(request);

        expect(response.status).toBe(200);
        expect(prisma.collection.create).toHaveBeenCalledWith({
          data: { userId: mockUserId },
        });
      });
    });

    describe('Error Handling', () => {
      it('should handle invalid JSON gracefully', async () => {
        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: 'invalid json{',
          }
        );
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Internal server error');
      });

      it('should handle database errors gracefully', async () => {
        (prisma.collection.findUnique as jest.Mock).mockRejectedValue(
          new Error('Database error')
        );

        const request = new NextRequest(
          'http://localhost:3000/api/collections',
          {
            method: 'POST',
            body: JSON.stringify({ cardId: mockCardId, quantity: 1 }),
          }
        );
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Internal server error');
      });
    });
  });
});
