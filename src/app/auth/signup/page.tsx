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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {searchParams.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm text-center">
            {getErrorMessage(searchParams.error)}
          </div>
        )}
        <SignUpForm
          callbackUrl={searchParams.callbackUrl}
          className="max-w-md mx-auto"
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