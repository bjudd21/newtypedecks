// Individual card detail page
import { Suspense } from 'react';
import { PageLayout } from '@/components/layout';
import { CardDetailClient } from './CardDetailClient';

interface CardDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const { id } = await params;

  return (
    <PageLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <CardDetailClient cardId={id} />
      </Suspense>
    </PageLayout>
  );
}
