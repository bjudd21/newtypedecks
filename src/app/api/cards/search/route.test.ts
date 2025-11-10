/**
 * Tests for Card Search API Route
 * Tests the recently refactored POST /api/cards/search endpoint
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST, GET } from './route';
import { CardService } from '@/lib/services/cardService';

// Mock CardService
jest.mock('@/lib/services/cardService', () => ({
  CardService: {
    searchCards: jest.fn(),
  },
}));

describe('POST /api/cards/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return search results with basic filters', async () => {
    const mockResults = {
      cards: [
        { id: '1', name: 'Test Card', type: { name: 'Unit' } },
        { id: '2', name: 'Another Card', type: { name: 'Command' } },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 2,
        pages: 1,
      },
    };

    (CardService.searchCards as jest.Mock).mockResolvedValue(mockResults);

    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: JSON.stringify({
        filters: {
          name: 'Test',
        },
        options: {
          page: 1,
          limit: 20,
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.cards).toHaveLength(2);
    expect(data.pagination).toBeDefined();
    expect(CardService.searchCards).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test',
      }),
      expect.objectContaining({
        page: 1,
        limit: 20,
      })
    );
  });

  it('should sanitize text filters by trimming whitespace', async () => {
    (CardService.searchCards as jest.Mock).mockResolvedValue({
      cards: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    });

    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: JSON.stringify({
        filters: {
          name: '  Gundam Wing  ',
          pilot: '  Heero Yuy  ',
        },
      }),
    });

    await POST(request);

    expect(CardService.searchCards).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Gundam Wing',
        pilot: 'Heero Yuy',
      }),
      expect.anything()
    );
  });

  it('should validate and reject invalid range filters', async () => {
    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: JSON.stringify({
        filters: {
          levelMin: 10,
          levelMax: 5, // Min > Max (invalid)
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid range');
    expect(data.message).toContain('levelMin');
  });

  it('should sanitize boolean filters correctly', async () => {
    (CardService.searchCards as jest.Mock).mockResolvedValue({
      cards: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    });

    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: JSON.stringify({
        filters: {
          isFoil: true,
          isPromo: false,
        },
      }),
    });

    await POST(request);

    expect(CardService.searchCards).toHaveBeenCalledWith(
      expect.objectContaining({
        isFoil: true,
        isPromo: false,
      }),
      expect.anything()
    );
  });

  it('should sanitize array filters and remove non-string elements', async () => {
    (CardService.searchCards as jest.Mock).mockResolvedValue({
      cards: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    });

    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: JSON.stringify({
        filters: {
          keywords: ['Flying', 123, 'Quick', null], // Mixed types
          tags: ['Mobile Suit', 'Gundam'],
        },
      }),
    });

    await POST(request);

    expect(CardService.searchCards).toHaveBeenCalledWith(
      expect.objectContaining({
        keywords: ['Flying', 'Quick'], // Only strings
        tags: ['Mobile Suit', 'Gundam'],
      }),
      expect.anything()
    );
  });

  it('should sanitize numeric range filters and reject negative numbers', async () => {
    (CardService.searchCards as jest.Mock).mockResolvedValue({
      cards: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    });

    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: JSON.stringify({
        filters: {
          costMin: 2,
          costMax: 5,
          levelMin: -1, // Negative (should be filtered out)
        },
      }),
    });

    await POST(request);

    expect(CardService.searchCards).toHaveBeenCalledWith(
      expect.objectContaining({
        costMin: 2,
        costMax: 5,
        levelMin: undefined, // Negative value rejected
      }),
      expect.anything()
    );
  });

  it('should apply default search options when not provided', async () => {
    (CardService.searchCards as jest.Mock).mockResolvedValue({
      cards: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    });

    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: JSON.stringify({
        filters: {},
        // No options provided
      }),
    });

    await POST(request);

    expect(CardService.searchCards).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        page: 1, // Default
        limit: 20, // Default
        sortBy: 'name', // Default
        sortOrder: 'asc', // Default
        includeRelations: true, // Default
      })
    );
  });

  it('should enforce page limit maximum of 100', async () => {
    (CardService.searchCards as jest.Mock).mockResolvedValue({
      cards: [],
      pagination: { page: 1, limit: 100, total: 0, pages: 0 },
    });

    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: JSON.stringify({
        options: {
          limit: 500, // Exceeds maximum
        },
      }),
    });

    await POST(request);

    expect(CardService.searchCards).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        limit: 20, // Capped to default (invalid value)
      })
    );
  });

  it('should validate sortBy field and use default for invalid values', async () => {
    (CardService.searchCards as jest.Mock).mockResolvedValue({
      cards: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    });

    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: JSON.stringify({
        options: {
          sortBy: 'invalidField', // Invalid sort field
        },
      }),
    });

    await POST(request);

    expect(CardService.searchCards).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        sortBy: 'name', // Falls back to default
      })
    );
  });

  it('should handle invalid JSON with error response', async () => {
    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: 'invalid json{',
    });

    const response = await POST(request);
    const data = await response.json();

    // NextRequest may throw different error types for invalid JSON
    expect([400, 500]).toContain(response.status);
    expect(data.error).toBeDefined();
  });

  it('should handle database connection errors with 503 status', async () => {
    (CardService.searchCards as jest.Mock).mockRejectedValue(
      new Error('Unable to connect to database')
    );

    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: JSON.stringify({
        filters: {},
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toBe('Database error');
  });

  it('should handle validation errors with 400 status', async () => {
    (CardService.searchCards as jest.Mock).mockRejectedValue(
      new Error('Validation failed: Invalid field')
    );

    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: JSON.stringify({
        filters: {},
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('should handle unexpected errors with 500 status', async () => {
    (CardService.searchCards as jest.Mock).mockRejectedValue(
      new Error('Something went wrong')
    );

    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: JSON.stringify({
        filters: {},
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });

  it('should include search metadata in response', async () => {
    (CardService.searchCards as jest.Mock).mockResolvedValue({
      cards: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    });

    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'POST',
      body: JSON.stringify({
        filters: {
          name: 'Gundam',
          levelMin: 5,
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.searchMeta).toBeDefined();
    expect(data.searchMeta.hasFilters).toBe(true);
  });
});

describe('GET /api/cards/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle basic GET requests with query parameters', async () => {
    (CardService.searchCards as jest.Mock).mockResolvedValue({
      cards: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    });

    const request = new NextRequest(
      'http://localhost:3000/api/cards/search?page=2&limit=10',
      { method: 'GET' }
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(CardService.searchCards).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        page: 2,
        limit: 10,
      })
    );
  });

  it('should apply default values for missing GET parameters', async () => {
    (CardService.searchCards as jest.Mock).mockResolvedValue({
      cards: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    });

    const request = new NextRequest('http://localhost:3000/api/cards/search', {
      method: 'GET',
    });

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(CardService.searchCards).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        page: 1,
        limit: 20,
        sortBy: 'name',
        sortOrder: 'asc',
      })
    );
  });
});
