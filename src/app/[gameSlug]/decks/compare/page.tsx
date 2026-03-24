/**
 * Deck comparison page
 * URL: /[gameSlug]/decks/compare?a=<deckId>&b=<deckId>
 *
 * Fetches both decks server-side with visibility checks, then hands off
 * to the client component for interactive swapping and rendering.
 */

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';
import { checkDeckAccess } from '@/app/api/decks/[id]/helpers';
import { PageLayout } from '@/components/layout';
import { DeckComparisonView } from '@/components/deck/DeckComparison';
import type { ComparableDeck } from '@/components/deck/DeckComparison/types';

interface ComparePageProps {
  params: Promise<{ gameSlug: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
}

async function fetchDeckForCompare(
  id: string,
  userId?: string
): Promise<ComparableDeck | null> {
  const { allowed } = await checkDeckAccess(id, userId);
  if (!allowed) return null;

  const deck = await prisma.deck.findUnique({
    where: { id },
    include: {
      cards: {
        include: {
          card: {
            include: { type: true, rarity: true },
          },
        },
      },
      user: { select: { id: true, name: true } },
    },
  });

  if (!deck) return null;

  return {
    id: deck.id,
    name: deck.name,
    description: deck.description,
    visibility: deck.visibility,
    userId: deck.userId,
    user: deck.user,
    createdAt: deck.createdAt.toISOString(),
    cards: deck.cards.map((dc) => ({
      cardId: dc.cardId,
      quantity: dc.quantity,
      category: dc.category ?? 'main',
      card: {
        id: dc.card.id,
        name: dc.card.name,
        cost: dc.card.cost,
        type: dc.card.type,
        rarity: dc.card.rarity,
        imageUrl: dc.card.imageUrl,
        imageUrlSmall: dc.card.imageUrlSmall,
      },
    })),
  };
}

export default async function ComparePage({
  params,
  searchParams,
}: ComparePageProps) {
  const { gameSlug } = await params;
  const { a, b } = await searchParams;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [deckA, deckB] = await Promise.all([
    a ? fetchDeckForCompare(a, userId) : Promise.resolve(null),
    b ? fetchDeckForCompare(b, userId) : Promise.resolve(null),
  ]);

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625]">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="bg-gradient-to-r from-[#8b7aaa] via-[#a89ec7] to-[#8b7aaa] bg-clip-text text-3xl font-bold text-transparent">
              Deck Comparison
            </h1>
            <p className="mt-1 text-gray-400">
              Compare any two{' '}
              <span className="capitalize">{gameSlug.replace(/-/g, ' ')}</span>{' '}
              decks side by side
            </p>
          </div>
          <DeckComparisonView initialDeckA={deckA} initialDeckB={deckB} />
        </div>
      </div>
    </PageLayout>
  );
}
