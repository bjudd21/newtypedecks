/**
 * Tests for User Signup API Route
 * Tests authentication, validation, rate limiting, and email verification
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST } from './route';
import * as authUtils from '@/lib/auth-utils';
import { prisma } from '@/lib/database';
import * as emailService from '@/lib/services/emailService';
import * as tokens from '@/lib/utils/tokens';

// Mock dependencies
jest.mock('@/lib/auth-utils');
jest.mock('@/lib/database', () => ({
  prisma: {
    user: {
      update: jest.fn(),
    },
  },
}));
jest.mock('@/lib/services/emailService');
jest.mock('@/lib/utils/tokens');

describe('POST /api/auth/signup', () => {
  const mockEmail = 'test@example.com';
  const mockPassword = 'SecurePass123!';
  const mockName = 'Test User';

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (authUtils.checkRateLimit as jest.Mock).mockReturnValue({
      allowed: true,
      resetTime: null,
    });
    (authUtils.validateEmail as jest.Mock).mockReturnValue({
      isValid: true,
      error: null,
    });
    (authUtils.validatePassword as jest.Mock).mockReturnValue({
      isValid: true,
      errors: [],
    });
    (tokens.generateUrlSafeToken as jest.Mock).mockReturnValue('mock-token-123');
    (tokens.generateEmailVerificationExpiration as jest.Mock).mockReturnValue(
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    );
    (emailService.sendEmailVerification as jest.Mock).mockResolvedValue(true);
  });

  describe('Successful Registration', () => {
    it('should create user with valid email and password', async () => {
      (authUtils.createUser as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          id: 'user-123',
          email: mockEmail,
          name: mockName,
          role: 'USER',
          emailVerified: null,
        },
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: mockPassword,
          name: mockName,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toContain('User created successfully');
      expect(data.user).toEqual({
        id: 'user-123',
        email: mockEmail,
        name: mockName,
        role: 'USER',
        emailVerified: null,
      });
      expect(authUtils.createUser).toHaveBeenCalledWith({
        email: mockEmail,
        password: mockPassword,
        name: mockName,
      });
    });

    it('should create user without name (optional field)', async () => {
      (authUtils.createUser as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          id: 'user-123',
          email: mockEmail,
          name: null,
          role: 'USER',
          emailVerified: null,
        },
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: mockPassword,
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(authUtils.createUser).toHaveBeenCalledWith({
        email: mockEmail,
        password: mockPassword,
        name: null,
      });
    });

    it('should generate and save email verification token', async () => {
      (authUtils.createUser as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          id: 'user-123',
          email: mockEmail,
          name: mockName,
          role: 'USER',
          emailVerified: null,
        },
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: mockPassword,
          name: mockName,
        }),
      });

      await POST(request);

      expect(tokens.generateUrlSafeToken).toHaveBeenCalled();
      expect(tokens.generateEmailVerificationExpiration).toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          emailVerificationToken: 'mock-token-123',
          emailVerificationExpires: expect.any(Date),
        },
      });
    });

    it('should send verification email', async () => {
      (authUtils.createUser as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          id: 'user-123',
          email: mockEmail,
          name: mockName,
          role: 'USER',
          emailVerified: null,
        },
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: mockPassword,
          name: mockName,
        }),
      });

      await POST(request);

      expect(emailService.sendEmailVerification).toHaveBeenCalledWith(
        mockEmail,
        expect.objectContaining({
          username: mockName,
          verificationUrl: expect.stringContaining('mock-token-123'),
        })
      );
    });

    it('should succeed even if email sending fails', async () => {
      (authUtils.createUser as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          id: 'user-123',
          email: mockEmail,
          name: mockName,
          role: 'USER',
          emailVerified: null,
        },
      });
      (emailService.sendEmailVerification as jest.Mock).mockResolvedValue(false);

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: mockPassword,
          name: mockName,
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      // Should still succeed even if email fails
    });
  });

  describe('Validation Errors', () => {
    it('should reject request without email', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          password: mockPassword,
          name: mockName,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Email and password are required');
    });

    it('should reject request without password', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          name: mockName,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Email and password are required');
    });

    it('should reject invalid email format', async () => {
      (authUtils.validateEmail as jest.Mock).mockReturnValue({
        isValid: false,
        error: 'Invalid email format',
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: mockPassword,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid email format');
    });

    it('should reject weak password', async () => {
      (authUtils.validatePassword as jest.Mock).mockReturnValue({
        isValid: false,
        errors: ['Password must be at least 8 characters', 'Must contain uppercase'],
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: 'weak',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Password does not meet security requirements');
      expect(data.details).toEqual([
        'Password must be at least 8 characters',
        'Must contain uppercase',
      ]);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limit after too many attempts', async () => {
      const resetTime = Date.now() + 900000; // 15 minutes
      (authUtils.checkRateLimit as jest.Mock).mockReturnValue({
        allowed: false,
        resetTime,
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: mockPassword,
        }),
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toContain('Too many registration attempts');
      expect(data.resetTime).toBe(resetTime);
      expect(authUtils.checkRateLimit).toHaveBeenCalledWith(
        'signup:192.168.1.1',
        3,
        900000
      );
    });

    it('should use x-real-ip header if x-forwarded-for is not present', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: mockPassword,
        }),
        headers: {
          'x-real-ip': '10.0.0.1',
        },
      });

      await POST(request);

      expect(authUtils.checkRateLimit).toHaveBeenCalledWith(
        'signup:10.0.0.1',
        3,
        900000
      );
    });

    it('should use "unknown" if no IP headers present', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: mockPassword,
        }),
      });

      await POST(request);

      expect(authUtils.checkRateLimit).toHaveBeenCalledWith(
        'signup:unknown',
        3,
        900000
      );
    });
  });

  describe('Duplicate User Handling', () => {
    it('should reject signup for existing user', async () => {
      (authUtils.createUser as jest.Mock).mockResolvedValue({
        success: false,
        error: 'User with this email already exists',
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: mockPassword,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409); // Conflict
      expect(data.error).toBe('User with this email already exists');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: 'invalid json{',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle database errors gracefully', async () => {
      (authUtils.createUser as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: mockPassword,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle email service errors gracefully', async () => {
      (authUtils.createUser as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          id: 'user-123',
          email: mockEmail,
          name: mockName,
          role: 'USER',
          emailVerified: null,
        },
      });
      (emailService.sendEmailVerification as jest.Mock).mockRejectedValue(
        new Error('Email service unavailable')
      );

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: mockPassword,
          name: mockName,
        }),
      });

      const response = await POST(request);

      // Should still succeed even if email sending throws error
      expect(response.status).toBe(201);
    });
  });

  describe('Security Considerations', () => {
    it('should not include password in response', async () => {
      (authUtils.createUser as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          id: 'user-123',
          email: mockEmail,
          name: mockName,
          role: 'USER',
          emailVerified: null,
          password: 'hashed-password', // Should never be in response
        },
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: mockPassword,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.user.password).toBeUndefined();
    });

    it('should not expose verification token in response', async () => {
      (authUtils.createUser as jest.Mock).mockResolvedValue({
        success: true,
        user: {
          id: 'user-123',
          email: mockEmail,
          name: mockName,
          role: 'USER',
          emailVerified: null,
        },
      });

      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: mockEmail,
          password: mockPassword,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.user.emailVerificationToken).toBeUndefined();
      expect(data.user.emailVerificationExpires).toBeUndefined();
    });
  });
});
