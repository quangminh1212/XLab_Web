import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Danh sách các đường dẫn được bảo vệ (yêu cầu đăng nhập)
const protectedPaths = [
  '/account',
  '/checkout',
  '/api/protected',
];

// Danh sách các đường dẫn công khai (không cần đăng nhập)
const publicPaths = [
  '/login',
  '/register',
  '/products',
  '/services',
  '/support',
  '/contact',
  '/api/auth',
  '/blog',
];

// Kiểm tra xem đường dẫn có thuộc danh sách được bảo vệ hay không
const isProtectedPath = (path: string) => {
  return protectedPaths.some((protectedPath) => 
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  );
};

// Kiểm tra xem đường dẫn có thuộc danh sách công khai hay không
const isPublicPath = (path: string) => {
  return publicPaths.some((publicPath) => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  );
};

/**
 * Middleware cho phép log tất cả các request và lỗi
 */
export async function middleware(request: NextRequest) {
  const { pathname, search, origin } = request.nextUrl;
  const fullUrl = `${origin}${pathname}${search}`;
  
  // Log thông tin request
  console.log(`[Middleware] Request: ${request.method} ${fullUrl}`);
  
  try {
    // Bỏ qua các tài nguyên tĩnh và api routes không được bảo vệ
    if (
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api/') && !pathname.startsWith('/api/protected') ||
      pathname.startsWith('/static') || 
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    // Lấy token xác thực
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Nếu đường dẫn được bảo vệ và người dùng chưa đăng nhập
    if (isProtectedPath(pathname) && !token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    // Nếu đường dẫn công khai (login/register) và người dùng đã đăng nhập
    if ((pathname === '/login' || pathname === '/register') && token) {
      return NextResponse.redirect(new URL('/account', request.url));
    }

    // Thêm security headers
    const response = NextResponse.next();
    
    // CSP Header
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self' data:;
      connect-src 'self' https://www.google-analytics.com;
      frame-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', cspHeader);
    
    return response;
  } catch (error) {
    // Log lỗi nếu có
    console.error('[Middleware] Error:', error);
    
    // Vẫn cho phép request tiếp tục để xem lỗi hiển thị như thế nào
    return NextResponse.next();
  }
}

// Cấu hình đường dẫn mà middleware sẽ được thực thi
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 