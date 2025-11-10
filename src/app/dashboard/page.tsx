import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { UserDashboard } from '@/components/dashboard/UserDashboard';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserDashboard user={session.user} />
    </div>
  );
}

export const metadata = {
  title: 'Dashboard | Gundam Card Game',
  description: 'Your personal Gundam Card Game dashboard',
};
