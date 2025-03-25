import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('[Middleware] Request:', request.method, request.url);
  
  // Chặn truy cập vào các đường dẫn tạm thời
  if (request.nextUrl.pathname.startsWith('/private')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Thêm header security
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}

// Các routes được áp dụng middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 