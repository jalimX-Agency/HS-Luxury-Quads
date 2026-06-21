import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/admin-session';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  const session = await getAdminSessionFromRequest(request);
  const isAuthenticated = Boolean(session);
  const isLoginPage = pathname === '/admin/login';
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  const isLoginApi = pathname === '/api/admin/login';

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (isAdminPage && !isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isAdminApi && !isLoginApi && !isAuthenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*', '/api/admin/:path*'],
};
