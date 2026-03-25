import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { SignUpForm } from '@/components/auth/SignUpForm';

interface SignUpPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  // Redirect if user is already signed in
  if (session) {
    redirect(params.callbackUrl || '/');
  }

  return (
    <div className="relative flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="bg-primary/8 absolute top-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md space-y-8">
        {params.error && (
          <div className="rounded border border-red-900/50 bg-red-950/30 px-4 py-3 text-center text-sm text-red-400">
            {getErrorMessage(params.error)}
          </div>
        )}
        <SignUpForm
          callbackUrl={params.callbackUrl}
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
  title: 'Sign Up | Newtype Decks',
  description: 'Create your Newtype Decks account',
};
