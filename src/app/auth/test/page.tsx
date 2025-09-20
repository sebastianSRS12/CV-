'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Session Status</h2>
          <pre className="bg-black text-green-400 p-4 rounded-md overflow-x-auto text-sm">
            {JSON.stringify({ status, session }, null, 2)}
          </pre>
        </div>

        <div className="space-y-4">
          {!session ? (
            <>
              <button
                onClick={() => signIn('google')}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign in with Google
              </button>
              <button
                onClick={() => signIn('github')}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Sign in with GitHub
              </button>
            </>
          ) : (
            <>
              <div className="p-4 bg-green-50 text-green-700 rounded-md">
                <p>Signed in as {session.user?.email}</p>
              </div>
              <button
                onClick={() => signOut()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign out
              </button>
            </>
          )}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <h3 className="text-sm font-medium text-yellow-800">Debug Information</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'Not set'}</p>
            <p>NODE_ENV: {process.env.NODE_ENV || 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
