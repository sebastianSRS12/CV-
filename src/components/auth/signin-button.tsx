'use client';

import { signIn } from 'next-auth/react';
import { FaGoogle, FaGithub } from 'react-icons/fa';

interface SignInButtonProps {
  provider: 'google' | 'github' | string;
}

export function SignInButton({ provider }: SignInButtonProps) {
  const handleSignIn = async () => {
    console.log(`Attempting to sign in with ${provider}`);
    try {
      const result = await signIn(provider.toLowerCase(), { 
        callbackUrl: '/dashboard',
        redirect: false 
      });
      
      if (result?.error) {
        console.error('Sign in error:', result.error);
        // You can add a toast notification here if you want
        alert(`Failed to sign in with ${provider}: ${result.error}`);
      } else if (result?.url) {
        // If we get a URL, redirect to it (handles OAuth flow)
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      alert('An unexpected error occurred. Please check the console for details.');
    }
  };

  const providerIcons: { [key: string]: React.ReactElement } = {
    google: <FaGoogle className="w-5 h-5" />,
    github: <FaGithub className="w-5 h-5" />,
  };

  const providerNames: { [key: string]: string } = {
    google: 'Google',
    github: 'GitHub',
  };
  
  const buttonColors: { [key: string]: string } = {
    google: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    github: 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-500',
    default: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
  };

  return (
    <button
      onClick={handleSignIn}
      className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        buttonColors[provider.toLowerCase()] || buttonColors.default
      }`}
      data-testid={`${provider.toLowerCase()}-signin-button`}
    >
      <span className="absolute left-0 inset-y-0 flex items-center pl-3" data-testid={`${provider.toLowerCase()}-icon`}>
        {providerIcons[provider.toLowerCase()] || null}
      </span>
      Continue with {providerNames[provider.toLowerCase()] || provider}
    </button>
  );
}
