/**
 * Password reset request API endpoint
 * Generates a reset token and sends email to user
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { sendPasswordReset } from '@/lib/services/emailService';
import { generateToken, generateTokenExpiration } from '@/lib/utils/tokens';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateToken();
    const resetExpires = generateTokenExpiration();

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

    // Send password reset email
    const emailSent = await sendPasswordReset(user.email, {
      username: user.name || user.email,
      resetUrl,
    });

    if (!emailSent) {
      console.error('Failed to send password reset email to:', user.email);
      return NextResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}