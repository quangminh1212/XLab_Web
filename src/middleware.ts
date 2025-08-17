import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { buildCSP, generateNonce } from '@/lib/csp';
import { env } from '@/env';

// Định nghĩa các loại route
const ROUTES = {
  protected: ['/account', '/checkout', '/api/protected'],
  admin: ['/admin'],
  public: [
    '/login',
    '/register',
    '/about',
    '/products',
    '/accounts',
    '/services',
    '/support',
    '/contact',
    '/api/auth',
    '/',
  ],
  // Các đuôi file tĩnh cần bỏ qua
  staticExtensions: ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.ico', '.webmanifest', '.css', '.js', '.json', '.xml', '.txt'],
  // Các path pattern của file tĩnh
  staticPaths: ['/_next/', '/images/', '/favicon.ico'],
};

// Danh sách email admin (lưu ở một nơi tập trung)
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || ['xlab.rnd@gmail.com'];

/**
 * Kiểm tra xem đường dẫn có thuộc loại được xác định hay không
 * @param path Đường dẫn cần kiểm tra
 * @param routeList Danh sách đường dẫn tham chiếu
 */
const matchesRoute = (path: string, routeList: string[]): boolean => {
  return routeList.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
};

/**
 * Kiểm tra nếu đường dẫn là tệp tĩnh
 * @param path Đường dẫn cần kiểm tra
 */
const isStaticFile = (path: string): boolean => {
  return (
    ROUTES.staticPaths.some(pattern => path.includes(pattern)) ||
    ROUTES.staticExtensions.some(ext => path.endsWith(ext))
  );
};

/**
 * Log thông tin debug (chỉ trong development)
 */
const logDebug = (request: NextRequest, token: any): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware Debug]:', {
      path: request.nextUrl.pathname,
      token: token ? `Found (${token.email})` : 'Not found',
    });
  }
};

/**
 * Kiểm tra quyền admin
 * @param token NextAuth token
 */
const isAdmin = (token: any): boolean => {
  return token?.email && ADMIN_EMAILS.includes(token.email);
};

/**
 * Tạo response chuyển hướng đến trang đăng nhập
 */
const redirectToLogin = (request: NextRequest, callbackPath: string): NextResponse => {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('callbackUrl', callbackPath);
  return NextResponse.redirect(loginUrl);
};

/**
 * Middleware chính để xử lý kiểm tra quyền truy cập
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Bỏ qua các file static và api auth routes không cần kiểm tra
  if (isStaticFile(pathname) || pathname.includes('/api/auth')) {
    return NextResponse.next();
  }

  // Lấy token từ cookie với secret từ environment
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build',
  });

  // Log thông tin debug trong môi trường phát triển
  logDebug(request, token);

  // Xử lý đường dẫn admin
  if (matchesRoute(pathname, ROUTES.admin)) {
    // Nếu chưa đăng nhập, chuyển đến login
    if (!token) {
      return redirectToLogin(request, pathname);
    }

    // Kiểm tra có quyền admin không
    if (!isAdmin(token)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Xử lý đường dẫn được bảo vệ
  if (matchesRoute(pathname, ROUTES.protected) && !token) {
    return redirectToLogin(request, pathname);
  }

  // Mọi route khác được xử lý bởi Next.js App Router
  const res = NextResponse.next();

  // Thiết lập CSP với nonce per-request
  const nonce = generateNonce();
  const strictStyles = env.STRICT_CSP_STYLES === 'true' && process.env.NODE_ENV === 'production';
  const csp = buildCSP(nonce, process.env.NODE_ENV === 'production', strictStyles);
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('x-csp-nonce', nonce);

  return res;
}

export const config = {
  // Chỉ áp dụng cho các đường dẫn cần kiểm tra
  matcher: ['/admin/:path*', '/account/:path*', '/checkout/:path*', '/api/protected/:path*'],
};
