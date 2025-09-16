import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/error',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/api/health',
  '/api/cv',
  '/api/ai',
  '/api/pdf'
];

// Security headers for all responses
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.vercel-insights.com; frame-ancestors 'none';"
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Skip middleware for public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return response;
  }

  // Get session token
  const session = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // For API routes, return 401 instead of redirect
  if (pathname.startsWith('/api/')) {
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return response;
  }

  // Redirect to login if not authenticated
  if (!session) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
