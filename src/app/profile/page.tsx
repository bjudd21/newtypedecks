import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { UserProfile } from '@/components/profile/UserProfile';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/profile');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Profile Settings
        </h1>
        <UserProfile user={session.user} />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Profile Settings | Gundam Card Game',
  description: 'Manage your profile settings and preferences',
};
