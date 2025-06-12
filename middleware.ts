import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the request is for the dashboard route group
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
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
        // Regular users get redirected to their profile page
        return NextResponse.redirect(new URL('/profile', request.url));
      }
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Check if regular user is trying to access admin-only pages
  if (pathname.startsWith('/profile') || pathname.startsWith('/my-courses')) {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
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
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/my-courses/:path*'
  ]
}; 