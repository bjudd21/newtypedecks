// Individual card detail page — ISR cached for 24h
import { notFound } from 'next/navigation';
import { PageLayout } from '@/components/layout';
import { CardDetailClient } from './CardDetailClient';
import { CardService } from '@/lib/services/cardService';
import { getGameBySlug } from '@/lib/database/games';

export const revalidate = 86400;

interface CardDetailPageProps {
  params: Promise<{
    gameSlug: string;
    id: string;
  }>;
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const { gameSlug, id } = await params;

  const [card, game] = await Promise.all([
    CardService.getCardById(id, true),
    getGameBySlug(gameSlug),
  ]);

  if (!game || !card || card.gameId !== game.id) {
    notFound();
  }

  return (
    <PageLayout>
      <CardDetailClient cardId={id} initialCard={card} />
    </PageLayout>
  );
}
