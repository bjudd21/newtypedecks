import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { UsersPageClient } from './UsersPageClient';

export const metadata = {
  title: 'User Management | Admin',
  description: 'Manage user accounts',
};

export default async function AdminUsersPage() {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/admin/users');
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect('/admin');
  }

  return <UsersPageClient />;
}
