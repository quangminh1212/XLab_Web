import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Danh sách các đường dẫn được bảo vệ (yêu cầu đăng nhập)
const protectedPaths = ['/account', '/checkout', '/api/protected'];

// Danh sách các đường dẫn chỉ dành cho admin
const adminPaths = ['/admin'];

// Danh sách email admin (giữ đồng bộ với NextAuth)
const ADMIN_EMAILS = ['xlab.rnd@gmail.com'];

// Danh sách các đường dẫn công khai (không cần đăng nhập)
const publicPaths = [
  '/login',
  '/register',
  '/about',
  '/products',
  '/accounts',
  '/services',
  '/support',
  '/contact',
  '/api/auth',
];

// Kiểm tra xem đường dẫn có thuộc danh sách được bảo vệ hay không
const isProtectedPath = (path: string) => {
  return protectedPaths.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`),
  );
};

// Kiểm tra xem đường dẫn có thuộc danh sách admin hay không
const isAdminPath = (path: string) => {
  return adminPaths.some((adminPath) => path === adminPath || path.startsWith(`${adminPath}/`));
};

// Kiểm tra xem đường dẫn có thuộc danh sách công khai hay không
const isPublicPath = (path: string) => {
  return publicPaths.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`));
};

// Kiểm tra nếu đường dẫn là tệp tĩnh
const isStaticFile = (path: string) => {
  return (
    path.includes('/_next/') ||
    path.includes('/images/') ||
    path.includes('/favicon.ico') ||
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.jpeg') ||
    path.endsWith('.svg') ||
    path.endsWith('.gif') ||
    path.endsWith('.ico') ||
    path.endsWith('.webmanifest') ||
    path.endsWith('.css') ||
    path.endsWith('.js') ||
    path.endsWith('.json') ||
    path.endsWith('.xml') ||
    path.endsWith('.txt')
  );
};

// Hàm debug để kiểm tra token và đường dẫn (chỉ trong development)
const debug = (request: NextRequest, token: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware Debug]:', {
      path: request.nextUrl.pathname,
      token: token ? `Found (${token.email})` : 'Not found',
    });
  }
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Bỏ qua các file static và api routes không cần kiểm tra
  if (isStaticFile(pathname) || pathname.includes('/api/auth')) {
    return NextResponse.next();
  }

  // Thêm các HTTP Security Headers
  const response = NextResponse.next();
  
  // Thiết lập các header bảo mật
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content-Security-Policy nghiêm ngặt hơn cho môi trường production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://i.pravatar.cc https://images.unsplash.com https://lh3.googleusercontent.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none';"
    );
  }

  // Lấy token từ cookie với secret từ environment hoặc fallback
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build',
  });

  // Log thông tin debug
  debug(request, token);

  // Nếu là đường dẫn admin
  if (isAdminPath(pathname)) {
    // Nếu chưa đăng nhập, chuyển đến login
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURIComponent(pathname));
      return NextResponse.redirect(url);
    }

    // Kiểm tra email có trong danh sách admin không
    if (!token.email || !ADMIN_EMAILS.includes(token.email)) {
      // Chuyển hướng đến trang chính với mã trạng thái 403 Forbidden
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // Nếu là đường dẫn được bảo vệ và chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (isProtectedPath(pathname) && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Chỉ áp dụng cho các đường dẫn cần kiểm tra
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images|robots.txt).*)',
    '/admin/:path*', 
    '/account/:path*', 
    '/checkout/:path*', 
    '/api/protected/:path*'
  ],
};
