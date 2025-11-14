// Admin Dashboard Statistics API
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/adminAuth';
import { UserService } from '@/lib/services/userService';
import { prisma } from '@/lib/database';

// GET /api/admin/stats - Get overall dashboard statistics
export async function GET(_request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  try {
    // Fetch card count
    const cardCount = await prisma.card.count();

    // Fetch user statistics
    const userStats = await UserService.getUserStatistics();

    // Get recent activity (last 10 cards created)
    const recentCards = await prisma.card.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    const stats = {
      cards: {
        total: cardCount,
      },
      users: {
        total: userStats.total,
        byRole: userStats.byRole,
        recent: userStats.recentSignups,
      },
      recentActivity: recentCards.map((card) => ({
        type: 'card_created',
        name: card.name,
        timestamp: card.createdAt,
      })),
    };

    return NextResponse.json(
      {
        success: true,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin stats API GET error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
