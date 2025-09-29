/**
 * Template Usage API
 *
 * Handles creating new decks from templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: templateId } = await context.params;
    const { name, description, modifications } = await request.json();

    // Validate template exists and is public template
    const template = await prisma.deck.findUnique({
      where: {
        id: templateId,
        isTemplate: true,
        isPublic: true
      },
      include: {
        cards: {
          include: {
            card: true
          }
        }
      }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found or not available' },
        { status: 404 }
      );
    }

    // Create new deck from template
    const newDeck = await prisma.deck.create({
      data: {
        name: name?.trim() || `${template.name} Copy`,
        description: description?.trim() || `Based on ${template.name} template`,
        isPublic: false, // New decks are private by default
        isTemplate: false,
        userId: session.user.id,
        cards: {
          create: template.cards.map(templateCard => ({
            cardId: templateCard.cardId,
            quantity: templateCard.quantity,
            category: templateCard.category
          }))
        }
      },
      include: {
        cards: {
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
                set: true
              }
            }
          }
        }
      }
    });

    // Track template usage
    await prisma.deckTemplateUsage.create({
      data: {
        templateId,
        createdDeckId: newDeck.id,
        userId: session.user.id
      }
    });

    // Apply any modifications if provided
    if (modifications && Array.isArray(modifications) && modifications.length > 0) {
      // Remove specified cards
      const cardsToRemove = modifications.filter(mod => mod.action === 'remove');
      if (cardsToRemove.length > 0) {
        await prisma.deckCard.deleteMany({
          where: {
            deckId: newDeck.id,
            cardId: { in: cardsToRemove.map(mod => mod.cardId) }
          }
        });
      }

      // Add new cards
      const cardsToAdd = modifications.filter(mod => mod.action === 'add');
      if (cardsToAdd.length > 0) {
        await prisma.deckCard.createMany({
          data: cardsToAdd.map(mod => ({
            deckId: newDeck.id,
            cardId: mod.cardId,
            quantity: Math.max(1, Math.min(4, parseInt(mod.quantity) || 1)),
            category: mod.category || 'main'
          })),
          skipDuplicates: true
        });
      }

      // Update card quantities
      const cardsToUpdate = modifications.filter(mod => mod.action === 'update');
      for (const mod of cardsToUpdate) {
        await prisma.deckCard.updateMany({
          where: {
            deckId: newDeck.id,
            cardId: mod.cardId
          },
          data: {
            quantity: Math.max(1, Math.min(4, parseInt(mod.quantity) || 1))
          }
        });
      }
    }

    // Fetch the final deck with any modifications applied
    const finalDeck = await prisma.deck.findUnique({
      where: { id: newDeck.id },
      include: {
        cards: {
          include: {
            card: {
              include: {
                type: true,
                rarity: true,
                set: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(
      {
        message: 'Deck created from template successfully',
        deck: finalDeck,
        templateUsed: {
          id: template.id,
          name: template.name
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Use template error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}