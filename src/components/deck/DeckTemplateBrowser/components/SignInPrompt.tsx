/**
 * Sign-in prompt for unauthenticated users
 */

import React from 'react';

export const SignInPrompt: React.FC = () => {
  return (
    <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
      <strong>Sign in to use templates!</strong> Create an account or sign in to
      start building decks from these templates.
    </div>
  );
};
