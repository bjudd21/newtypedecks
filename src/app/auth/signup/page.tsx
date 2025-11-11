import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { SignUpForm } from '@/components/auth/SignUpForm';

interface SignUpPageProps {
  searchParams: {
    callbackUrl?: string;
    error?: string;
  };
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const session = await getServerSession(authOptions);

  // Redirect if user is already signed in
  if (session) {
    redirect(searchParams.callbackUrl || '/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {searchParams.error && (
          <div className="rounded border border-red-900/50 bg-red-950/30 px-4 py-3 text-center text-sm text-red-400">
            {getErrorMessage(searchParams.error)}
          </div>
        )}
        <SignUpForm
          callbackUrl={searchParams.callbackUrl}
          className="mx-auto max-w-md"
        />
      </div>
    </div>
  );
}

function getErrorMessage(error: string): string {
  switch (error) {
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'OAuthCreateAccount':
      return 'There was an issue with your OAuth provider. Please try again.';
    case 'EmailCreateAccount':
      return 'There was an issue creating your account with email. Please try again.';
    case 'Callback':
      return 'There was an issue with the authentication callback. Please try again.';
    case 'OAuthAccountNotLinked':
      return 'This email is already associated with another account. Please sign in instead.';
    case 'EmailSignin':
      return 'There was an issue sending the email. Please try again.';
    default:
      return 'An error occurred during sign up. Please try again.';
  }
}

export const metadata = {
  title: 'Sign Up | Gundam Card Game',
  description: 'Create your Gundam Card Game account',
};
