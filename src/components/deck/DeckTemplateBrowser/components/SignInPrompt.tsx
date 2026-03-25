/**
 * Sign-in prompt for unauthenticated users
 */

import React from 'react';

export const SignInPrompt: React.FC = () => {
  return (
    <div className="border-border bg-accent text-muted-foreground mt-4 rounded border p-3 text-sm">
      <strong>Sign in to use templates!</strong> Create an account or sign in to
      start building decks from these templates.
    </div>
  );
};
