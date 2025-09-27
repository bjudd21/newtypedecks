/**
 * User Registration API
 *
 * Handles user registration with email and password
 */

import { NextRequest, NextResponse } from 'next/server';
import { createUser, validateEmail, validatePassword, checkRateLimit } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Rate limiting
    const rateLimit = checkRateLimit(`signup:${clientIP}`, 3, 15 * 60 * 1000); // 3 attempts per 15 minutes
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many registration attempts. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      );
    }

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: 'Password does not meet security requirements',
          details: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Create user
    const result = await createUser({
      email,
      password,
      name: name || null,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 409 } // Conflict for existing user
      );
    }

    // Return success (don't include sensitive data)
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: result.user!.id,
          email: result.user!.email,
          name: result.user!.name,
          role: result.user!.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}