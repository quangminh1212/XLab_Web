import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { locales, defaultLocale, Locale } from './i18n/config';

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
 * Kiểm tra xem path có chứa locale hay không
 * @param path Đường dẫn cần kiểm tra
 */
const hasLocale = (path: string): boolean => {
  return locales.some(locale => path === `/${locale}` || path.startsWith(`/${locale}/`));
};

/**
 * Lấy locale từ path
 * @param path Đường dẫn cần kiểm tra
 */
const getLocaleFromPath = (path: string): Locale | undefined => {
  for (const locale of locales) {
    if (path === `/${locale}` || path.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return undefined;
};

/**
 * Log thông tin debug (chỉ trong development)
 */
const logDebug = (request: NextRequest, token: any, locale?: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware Debug]:', {
      path: request.nextUrl.pathname,
      token: token ? `Found (${token.email})` : 'Not found',
      locale: locale || 'Not specified',
      timestamp: new Date().toISOString(),
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
const redirectToLogin = (request: NextRequest, callbackPath: string, locale: string = defaultLocale): NextResponse => {
  const loginUrl = new URL(`/${locale}/login`, request.url);
  loginUrl.searchParams.set('callbackUrl', callbackPath);
  return NextResponse.redirect(loginUrl);
};

/**
 * Middleware chính để xử lý kiểm tra quyền truy cập và ngôn ngữ
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

  // Xử lý ngôn ngữ
  // Kiểm tra nếu path hiện tại không chứa locale
  if (!hasLocale(pathname)) {
    // Lấy locale từ cookie hoặc accept-language header hoặc dùng mặc định
    let locale: Locale = defaultLocale;
    
    // Thử lấy locale từ cookie
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value as Locale | undefined;
    if (localeCookie && locales.includes(localeCookie)) {
      locale = localeCookie;
    } else {
      // Thử lấy từ accept-language header
      const acceptLanguage = request.headers.get('accept-language');
      if (acceptLanguage) {
        for (const lang of acceptLanguage.split(',')) {
          const [langCode] = lang.trim().split(';');
          const twoLetterLangCode = langCode.substring(0, 2);
          if (locales.includes(twoLetterLangCode as Locale)) {
            locale = twoLetterLangCode as Locale;
            break;
          }
        }
      }
    }

    // Redirect tới cùng path nhưng có thêm locale
    const url = new URL(request.url);
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  // Đã có locale trong path, lấy nó ra
  const locale = getLocaleFromPath(pathname);

  // Log thông tin debug trong môi trường phát triển
  logDebug(request, token, locale);

  // Loại bỏ locale khỏi path để check routes
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '');
  
  // Xử lý đường dẫn admin
  if (matchesRoute(pathWithoutLocale, ROUTES.admin)) {
    // Nếu chưa đăng nhập, chuyển đến login
    if (!token) {
      return redirectToLogin(request, pathname, locale);
    }

    // Kiểm tra có quyền admin không
    if (!isAdmin(token)) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  // Xử lý đường dẫn được bảo vệ
  if (matchesRoute(pathWithoutLocale, ROUTES.protected) && !token) {
    return redirectToLogin(request, pathname, locale);
  }

  // Mọi route khác được xử lý bởi Next.js App Router
  return NextResponse.next();
}

export const config = {
  // Chỉ áp dụng cho các đường dẫn cần kiểm tra
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    '/admin/:path*', 
    '/account/:path*', 
    '/checkout/:path*', 
    '/api/protected/:path*'
  ],
};
