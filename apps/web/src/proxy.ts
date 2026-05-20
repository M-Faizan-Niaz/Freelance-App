import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Protected route prefixes — any path not starting with these is public.
 * Adjust to match your application's route structure.
 */
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/provider-dashboard',
  '/chat',
  '/payment',
  '/review',
  '/notifications',
];

/** better-auth session cookie name */
const SESSION_COOKIE = 'better-auth.session_token';

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip auth routes and static assets
  if (
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const sessionToken = request.cookies.get(SESSION_COOKIE);

  if (!sessionToken) {
    const signInUrl = new URL('/auth/sign-in', request.url);
    signInUrl.searchParams.set(
      'callbackUrl',
      pathname + (searchParams.size ? `?${searchParams}` : ''),
    );
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
