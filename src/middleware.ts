import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

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

// Cấu hình i18n middleware
const i18nMiddleware = createMiddleware({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Kiểm tra xem đường dẫn có cần bảo vệ không
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath) {
    const token = await getToken({req: request});
    
    if (!token) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Xử lý i18n routing
  return i18nMiddleware(request);
}

export const config = {
  matcher: [
    // Auth và bảo vệ đường dẫn
    '/admin/:path*',
    '/account/:path*',
    '/checkout/:path*',
    '/api/protected/:path*',
    // i18n routing (skip api and static files)
    '/((?!api|_next|.*\\..*).*)'
  ]
};
