import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Explicitly exclude public paths
  if (pathname === '/' || 
      pathname.startsWith('/landing') || 
      pathname.startsWith('/login') || 
      pathname.startsWith('/signup') || 
      pathname.startsWith('/course/') ||
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Check if the request is for the dashboard route group
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      // Decode JWT token to check user role
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role;
      
      // Only allow admin and superadmin to access dashboard
      if (userRole !== 'admin' && userRole !== 'superadmin') {
        // Regular users get redirected to their user dashboard
        return NextResponse.redirect(new URL('/user-dashboard/profile', request.url));
      }
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Check if user is trying to access user dashboard
  if (pathname.startsWith('/user-dashboard')) {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      // Decode JWT token to verify it's valid
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Check if regular user is trying to access legacy profile/my-courses pages
  if (pathname.startsWith('/profile') || pathname.startsWith('/my-courses')) {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      // Decode JWT token to verify it's valid
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      // Redirect to new user dashboard
      return NextResponse.redirect(new URL('/user-dashboard/profile', request.url));
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
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
}; 