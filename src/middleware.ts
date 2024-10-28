import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const protectedPaths = ['/users', '/api/users', '/api/tasks'];
  const pathname = req.nextUrl.pathname;
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    // Redirect to login page if not authenticated
    if (!token) {
      const loginUrl = new URL('/authentication/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname); // return to original page after login
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}
