import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { SignInForm } from '@/components/auth/SignInForm';

interface SignInPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  // Redirect if user is already signed in
  if (session) {
    redirect(params.callbackUrl || '/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {params.error && (
          <div className="rounded-lg border border-red-500/50 bg-red-950/30 px-4 py-3 text-center text-sm text-red-400">
            {getErrorMessage(params.error)}
          </div>
        )}
        <SignInForm
          callbackUrl={params.callbackUrl}
          className="mx-auto max-w-md"
        />
      </div>
    </div>
  );
}

function getErrorMessage(error: string): string {
  switch (error) {
    case 'CredentialsSignin':
      return 'Invalid email or password. Please try again.';
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'OAuthCreateAccount':
    case 'EmailCreateAccount':
      return 'There was an issue with your OAuth provider. Please try again.';
    case 'Callback':
      return 'There was an issue with the authentication callback. Please try again.';
    case 'OAuthAccountNotLinked':
      return 'This email is already associated with another account. Please sign in with your original method.';
    case 'EmailSignin':
      return 'There was an issue sending the email. Please try again.';
    case 'SessionRequired':
      return 'Please sign in to access this page.';
    default:
      return 'An error occurred during sign in. Please try again.';
  }
}

export const metadata = {
  title: 'Sign In | Gundam Card Game',
  description: 'Sign in to your Gundam Card Game account',
};
