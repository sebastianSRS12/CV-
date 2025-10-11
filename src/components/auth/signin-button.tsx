'use client';

import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

interface SignInButtonProps {
  provider: 'github' | string;
  className?: string;
}

export function SignInButton({ provider, className = '' }: SignInButtonProps) {
  const lowerProvider = provider.toLowerCase();

  const handleSignIn = async () => {
    console.log(`Attempting to sign in with ${provider}`);
    try {
      const result = await signIn(lowerProvider, {
        callbackUrl: '/dashboard',
      });
      if (result?.error) {
        console.error('Sign in error:', result.error);
        alert(`Failed to sign in with ${provider}: ${result.error}`);
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      alert('An unexpected error occurred. Please check the console for details.');
    }
  };

  const providerIcons: { [key: string]: React.ReactElement } = {
    github: <FaGithub className="w-6 h-6" />,
    google: <FcGoogle className="w-6 h-6" data-testid="google-icon" />,
  };

  const providerNames: { [key: string]: string } = {
    github: 'GitHub',
    google: 'Google',
  };

  const buttonColors: { [key: string]: string } = {
    github: 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-500',
    default: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
  };

  return (
    <button
      onClick={handleSignIn}
      className={`w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 ${buttonColors[lowerProvider] || buttonColors.default} focus:outline-none focus:ring-4 focus:ring-opacity-50 ${className}`}
    >
      <span className="mr-3">{providerIcons[lowerProvider] || null}</span>
      Continue with {providerNames[lowerProvider] || provider}
    </button>
  );
}