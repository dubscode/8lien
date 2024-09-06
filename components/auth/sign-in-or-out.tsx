'use client';

import { SignInButton } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';

export function SignInOrOut() {
  const { isAuthenticated } = useConvexAuth();
  return isAuthenticated ? (
    <UserButton afterSignOutUrl='/' />
  ) : (
    <SignInButton />
  );
}
