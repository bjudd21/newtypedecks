// Individual collection card API endpoints
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';
import { resolveGameFromRequest } from '@/app/api/_lib/resolveGame';

interface RouteParams {
  params: Promise<{
    cardId: string;
  }>;
}

// GET /api/collections/[cardId] - Get collection entry for a specific card
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { cardId } = await params;

    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const collectionCard = await prisma.collectionCard.findFirst({
      where: {
        cardId,
        collection: { userId: session.user.id, gameId },
      },
      include: {
        card: { include: { type: true, rarity: true } },
      },
    });

    if (!collectionCard) {
      return NextResponse.json(
        { error: 'Card not in collection' },
        { status: 404 }
      );
    }

    return NextResponse.json(collectionCard);
  } catch (error) {
    console.error('Get collection card error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/collections/[cardId] - Update quantity of a card in collection
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { cardId } = await params;

    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { quantity } = await request.json();
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    const userCollection = await prisma.collection.findFirst({
      where: { userId: session.user.id, gameId },
    });
    if (!userCollection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    const existing = await prisma.collectionCard.findUnique({
      where: {
        collectionId_cardId: { collectionId: userCollection.id, cardId },
      },
    });
    if (!existing) {
      return NextResponse.json(
        { error: 'Card not in collection' },
        { status: 404 }
      );
    }

    const updated = await prisma.collectionCard.update({
      where: {
        collectionId_cardId: { collectionId: userCollection.id, cardId },
      },
      data: { quantity: parsedQuantity },
      include: {
        card: { include: { type: true, rarity: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update collection card error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/collections/[cardId] - Remove card from collection
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { cardId } = await params;

    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userCollection = await prisma.collection.findFirst({
      where: { userId: session.user.id, gameId },
    });
    if (!userCollection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    const existing = await prisma.collectionCard.findUnique({
      where: {
        collectionId_cardId: { collectionId: userCollection.id, cardId },
      },
    });
    if (!existing) {
      return NextResponse.json(
        { error: 'Card not in collection' },
        { status: 404 }
      );
    }

    await prisma.collectionCard.delete({
      where: {
        collectionId_cardId: { collectionId: userCollection.id, cardId },
      },
    });

    return NextResponse.json({ message: 'Card removed from collection' });
  } catch (error) {
    console.error('Delete collection card error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
