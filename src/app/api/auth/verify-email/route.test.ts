/**
 * Tests for Email Verification API Route
 * Tests token validation, expiry checking, and email verification flow
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST } from './route';
import { prisma } from '@/lib/database';
import * as tokens from '@/lib/utils/tokens';
import * as emailService from '@/lib/services/emailService';

// Mock dependencies
jest.mock('@/lib/database', () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));
jest.mock('@/lib/utils/tokens');
jest.mock('@/lib/services/emailService');

describe('POST /api/auth/verify-email', () => {
  const mockToken = 'valid-token-123';
  const mockUserId = 'user-123';
  const mockEmail = 'test@example.com';
  const mockName = 'Test User';

  beforeEach(() => {
    jest.clearAllMocks();
    (emailService.sendWelcomeEmail as jest.Mock).mockResolvedValue(true);
  });

  describe('Successful Verification', () => {
    it('should verify email with valid token', async () => {
      const mockUser = {
        id: mockUserId,
        email: mockEmail,
        name: mockName,
        emailVerificationToken: mockToken,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        emailVerified: null,
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (tokens.isTokenExpired as jest.Mock).mockReturnValue(false);

      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ token: mockToken }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Email verified successfully');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: {
          emailVerified: expect.any(Date),
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      });
    });

    it('should send welcome email after successful verification', async () => {
      const mockUser = {
        id: mockUserId,
        email: mockEmail,
        name: mockName,
        emailVerificationToken: mockToken,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        emailVerified: null,
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (tokens.isTokenExpired as jest.Mock).mockReturnValue(false);

      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ token: mockToken }),
        }
      );

      await POST(request);

      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(
        mockEmail,
        mockName
      );
    });

    it('should succeed even if welcome email fails', async () => {
      const mockUser = {
        id: mockUserId,
        email: mockEmail,
        name: mockName,
        emailVerificationToken: mockToken,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        emailVerified: null,
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (tokens.isTokenExpired as jest.Mock).mockReturnValue(false);
      (emailService.sendWelcomeEmail as jest.Mock).mockResolvedValue(false);

      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ token: mockToken }),
        }
      );

      const response = await POST(request);

      expect(response.status).toBe(200);
      // Verification should succeed even if welcome email fails
    });

    it('should use email as username if name is not provided', async () => {
      const mockUser = {
        id: mockUserId,
        email: mockEmail,
        name: null,
        emailVerificationToken: mockToken,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        emailVerified: null,
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (tokens.isTokenExpired as jest.Mock).mockReturnValue(false);

      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ token: mockToken }),
        }
      );

      await POST(request);

      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(
        mockEmail,
        mockEmail
      );
    });
  });

  describe('Token Validation', () => {
    it('should reject request without token', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({}),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Verification token is required');
    });

    it('should reject invalid token (user not found)', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ token: 'invalid-token' }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid or expired verification token');
    });

    it('should reject if user found but no verification token stored', async () => {
      const mockUser = {
        id: mockUserId,
        email: mockEmail,
        name: mockName,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        emailVerified: null,
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ token: mockToken }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid or expired verification token');
    });

    it('should reject if verification token is null', async () => {
      const mockUser = {
        id: mockUserId,
        email: mockEmail,
        name: mockName,
        emailVerificationToken: null,
        emailVerificationExpires: new Date(),
        emailVerified: null,
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ token: mockToken }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid or expired verification token');
    });
  });

  describe('Token Expiry', () => {
    it('should reject expired token', async () => {
      const mockUser = {
        id: mockUserId,
        email: mockEmail,
        name: mockName,
        emailVerificationToken: mockToken,
        emailVerificationExpires: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expired
        emailVerified: null,
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (tokens.isTokenExpired as jest.Mock).mockReturnValue(true);

      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ token: mockToken }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Verification token has expired');
      expect(data.error).toContain('request a new verification email');
    });

    it('should clear expired token from database', async () => {
      const mockUser = {
        id: mockUserId,
        email: mockEmail,
        name: mockName,
        emailVerificationToken: mockToken,
        emailVerificationExpires: new Date(Date.now() - 24 * 60 * 60 * 1000),
        emailVerified: null,
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (tokens.isTokenExpired as jest.Mock).mockReturnValue(true);

      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ token: mockToken }),
        }
      );

      await POST(request);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: {
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      });
    });
  });

  describe('Already Verified', () => {
    it('should reject if email is already verified', async () => {
      const mockUser = {
        id: mockUserId,
        email: mockEmail,
        name: mockName,
        emailVerificationToken: mockToken,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        emailVerified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Already verified 7 days ago
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (tokens.isTokenExpired as jest.Mock).mockReturnValue(false);

      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ token: mockToken }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Email is already verified');
      // Should not update database if already verified
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON gracefully', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
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
      (prisma.user.findFirst as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ token: mockToken }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle database update errors gracefully', async () => {
      const mockUser = {
        id: mockUserId,
        email: mockEmail,
        name: mockName,
        emailVerificationToken: mockToken,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        emailVerified: null,
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (tokens.isTokenExpired as jest.Mock).mockReturnValue(false);
      (prisma.user.update as jest.Mock).mockRejectedValue(
        new Error('Update failed')
      );

      const request = new NextRequest(
        'http://localhost:3000/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ token: mockToken }),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
