// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const userData = request.cookies.get('userData');
  const { pathname } = request.nextUrl;

  let user = null;
  if (userData) {
    try {
      user = JSON.parse(userData.value);
    } catch (error) {
      console.error('Failed to parse user data from cookie:', error);
    }
  }

  // Redirect to login if no token and not on the login page
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in, prevent access to login page
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (user) {
    if (user.role === 'CASHIER') {
      // Cashier can only access /sales-history and is redirected there from /
      if (pathname !== '/sales-history') {
        return NextResponse.redirect(new URL('/sales-history', request.url));
      }
    } else if (user.role === 'ADMIN') {
      // Admin is redirected away from /sales-history
      if (pathname === '/sales-history') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } else if (user.role === 'SALESMAN') {
        // Salesman is redirected to products page from /
        if (pathname === '/') {
            return NextResponse.redirect(new URL('/products', request.url));
        }
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}