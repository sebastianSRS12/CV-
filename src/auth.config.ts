import type { DefaultSession } from 'next-auth';
import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user'];
  }
}

export const authConfig: AuthOptions = {
  // Custom pages for authentication
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  
  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Callbacks for customizing authentication flow
  callbacks: {
    // Redirect callback for after sign in
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful sign in
      if (url.startsWith(baseUrl)) return url;
      return baseUrl + '/dashboard';
    },
    
    // Session callback to add custom fields to the session
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    
    // JWT callback to add custom fields to the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    }
  },
  
  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',
  
  // Add your authentication providers here
  providers: [],
  
  // Secret used to encrypt cookies
  secret: process.env.NEXTAUTH_SECRET,
  
  // Trust the host header (handled by NextAuth internally)
};
