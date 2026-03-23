import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { GamesPageClient } from './GamesPageClient';

export const metadata = {
  title: 'Game Management | Admin',
  description: 'Manage TCG game records and configurations',
};

export default async function AdminGamesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/admin/games');
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect('/admin');
  }

  return <GamesPageClient />;
}
