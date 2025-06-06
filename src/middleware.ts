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

export const locales = ['vi', 'en'];
export const defaultLocale = 'vi';

// Function to determine if the path belongs to file-based routes that should be ignored by the middleware
function isFileBased(pathname: string) {
  return /\.(ico|png|jpg|jpeg|svg|css|js|json)$/.test(pathname) || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/') ||
    pathname.includes('favicon.ico') ||
    pathname.includes('site.webmanifest');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for file-based routes
  if (isFileBased(pathname)) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();
  
  // Skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get preferred locale from cookie or accept-language header
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  let locale = cookieLocale || defaultLocale;
  
  if (!cookieLocale) {
    // If no cookie, try to get locale from accept-language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      const preferredLocale = acceptLanguage
        .split(',')
        .map((lang) => lang.split(';')[0].trim())
        .find((lang) => locales.includes(lang.substring(0, 2)));
      
      if (preferredLocale) {
        locale = preferredLocale.substring(0, 2);
      }
    }
  }

  // Redirect to the locale path
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  
  // Set locale cookie in the response
  const response = NextResponse.redirect(url);
  response.cookies.set('NEXT_LOCALE', locale);
  
  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api)
    '/((?!api|_next/static|_next/image|_next/data|favicon.ico|images|site.webmanifest).*)',
  ],
};
