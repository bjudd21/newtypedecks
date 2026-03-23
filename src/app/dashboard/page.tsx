import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { getDashboardData } from '@/lib/database/dashboard';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  const dashboardData = await getDashboardData(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <UserDashboard user={session.user} dashboardData={dashboardData} />
    </div>
  );
}

export const metadata = {
  title: 'Dashboard | Newtype Decks',
  description: 'Your personal Newtype Decks dashboard',
};
