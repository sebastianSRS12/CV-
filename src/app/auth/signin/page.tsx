'use client';

import { useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignInButton } from "@/components/auth/signin-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>
        
        <div className="mt-8 space-y-6">
          {providers?.github && (
            <SignInButton provider="github" className="transform transition-transform hover:scale-105" />
          )}
          {providers?.google && (
            <SignInButton provider="google" className="transform transition-transform hover:scale-105 mt-4" />
          )}
          
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue as guest</span>
            </div>
          </div>
          
          <Button
            onClick={() => router.push('/dashboard')}
            aria-label="Continue as guest"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            Continue without signing in
          </Button>
          
          <form 
            action="/api/auth/signin/credentials" 
            method="post" 
            className="mt-6 space-y-4"
          >
            <input name="csrfToken" type="hidden" defaultValue="" />
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address (demo@example.com)"
                defaultValue="demo@example.com"
              />
            </div>
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Your name (Demo User)"
                defaultValue="Demo User"
              />
            </div>
            <Button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              Sign in with Demo Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
