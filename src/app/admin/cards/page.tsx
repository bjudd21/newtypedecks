import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { CardsPageClient } from './CardsPageClient';

export const metadata = {
  title: 'Card Management | Admin',
  description: 'Manage Gundam cards',
};

export default async function AdminCardsPage() {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/admin/cards');
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect('/admin');
  }

  return <CardsPageClient />;
}
