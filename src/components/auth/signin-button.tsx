'use client';

import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

interface SignInButtonProps {
  provider: string;
}

export function SignInButton({ provider }: SignInButtonProps) {
  const handleSignIn = () => {
    signIn(provider.toLowerCase(), { callbackUrl: '/dashboard' });
  };

  const providerIcons: { [key: string]: React.ReactElement } = {
    google: <FaGoogle className="w-5 h-5" />,
  };

  const providerNames: { [key: string]: string } = {
    google: 'Google',
  };

  return (
    <button
      onClick={handleSignIn}
      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      data-testid={`${provider.toLowerCase()}-signin-button`}
    >
      <span className="absolute left-0 inset-y-0 flex items-center pl-3" data-testid={`${provider.toLowerCase()}-icon`}>
        {providerIcons[provider.toLowerCase()] || null}
      </span>
      Continue with {providerNames[provider.toLowerCase()] || provider}
    </button>
  );
}
