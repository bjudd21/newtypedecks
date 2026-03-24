/**
 * Tests for /api/health
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { GET } from './route';
import { prisma } from '@/lib/database';
import { getServerSession } from 'next-auth/next';

jest.mock('@/lib/database', () => ({
  prisma: { $queryRaw: jest.fn() },
}));
jest.mock('next-auth/next');
jest.mock('@/lib/auth', () => ({ authOptions: {} }));

const makeRequest = (search = '') =>
  new NextRequest(`http://localhost:3000/api/health${search}`);

describe('/api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(null);
  });

  describe('public endpoint (no auth)', () => {
    it('returns ok when database is healthy', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ '?column?': 1 }]);

      const response = await GET(makeRequest());
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
      expect(data.database).toBe('connected');
      expect(data.rateLimit).toBe('in-memory-only-not-production-safe');
    });

    it('returns error when database is unreachable', async () => {
      (prisma.$queryRaw as jest.Mock).mockRejectedValue(
        new Error('Connection refused')
      );

      const response = await GET(makeRequest());
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.status).toBe('error');
      expect(data.database).toBe('error');
    });

    it('does not expose sensitive fields without auth', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([]);

      const response = await GET(makeRequest());
      const data = await response.json();

      expect(data.memory).toBeUndefined();
      expect(data.uptime).toBeUndefined();
      expect(data.nodeVersion).toBeUndefined();
    });
  });

  describe('verbose endpoint (?verbose=true)', () => {
    const MOCK_TOKEN = 'test-health-token';

    beforeEach(() => {
      process.env.HEALTH_CHECK_TOKEN = MOCK_TOKEN;
    });

    afterEach(() => {
      delete process.env.HEALTH_CHECK_TOKEN;
    });

    it('returns full details with valid HEALTH_CHECK_TOKEN', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([]);

      const request = new NextRequest(
        'http://localhost:3000/api/health?verbose=true',
        { headers: { Authorization: `Bearer ${MOCK_TOKEN}` } }
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.memory).toBeDefined();
      expect(data.uptime).toBeDefined();
      expect(data.nodeVersion).toBeDefined();
      expect(data.database).toMatchObject({ status: 'connected' });
    });

    it('returns full details with admin session', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([]);
      delete process.env.HEALTH_CHECK_TOKEN;
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      });

      const response = await GET(makeRequest('?verbose=true'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.memory).toBeDefined();
    });

    it('falls back to public response when auth fails', async () => {
      (prisma.$queryRaw as jest.Mock).mockResolvedValue([]);
      delete process.env.HEALTH_CHECK_TOKEN;

      const response = await GET(makeRequest('?verbose=true'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.memory).toBeUndefined();
    });

    it('includes db error in verbose response when db is down', async () => {
      (prisma.$queryRaw as jest.Mock).mockRejectedValue(
        new Error('ECONNREFUSED')
      );

      const request = new NextRequest(
        'http://localhost:3000/api/health?verbose=true',
        { headers: { Authorization: `Bearer ${MOCK_TOKEN}` } }
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.database.status).toBe('error');
      expect(data.database.error).toContain('ECONNREFUSED');
    });
  });
});
