/**
 * Admin Game by ID API
 *
 * PATCH /api/admin/games/[id] — update a game's metadata and config
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/adminAuth';
import { prisma } from '@/lib/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, shortName, publisher, isActive, sortOrder, config } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (shortName !== undefined) updateData.shortName = shortName;
    if (publisher !== undefined) updateData.publisher = publisher;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);
    if (config !== undefined) updateData.config = config;

    const game = await prisma.game.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, game });
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : 'Failed to update game';
    if (msg.includes('Record to update not found')) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      );
    }
    console.error('Admin game PATCH error:', error);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
