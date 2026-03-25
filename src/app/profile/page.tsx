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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-foreground mb-8 text-2xl font-semibold">
            Profile Settings
          </h1>
          <UserProfile user={session.user} />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Profile Settings | Newtype Decks',
  description: 'Manage your profile settings and preferences',
};
