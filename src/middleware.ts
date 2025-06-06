<<<<<<< HEAD
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
=======
import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
>>>>>>> a60ce285271f3e1cc6fa1403fb6885b1e5aefa10

const locales = ['en', 'vi'];
const publicPages = [
  '/',
  '/login',
  '/register',
  '/about',
  '/products',
  '/services',
  '/support',
  '/contact',
  '/vouchers/public',
  '/terms',
  '/privacy',
  '/bao-hanh',
  '/pricing',
  '/testimonials'
];

<<<<<<< HEAD
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
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Kiểm tra email có trong danh sách admin không
    if (!token.email || !ADMIN_EMAILS.includes(token.email)) {
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }
  }

  // Nếu là đường dẫn được bảo vệ và chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (isProtectedPath(pathname) && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Chỉ áp dụng cho các đường dẫn cần kiểm tra
  matcher: ['/admin/:path*', '/account/:path*', '/checkout/:path*', '/api/protected/:path*'],
=======
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'vi',
  localePrefix: 'always',
});

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith('/admin')) {
          return token?.email === 'xlab.rnd@gmail.com';
        }
        return token != null;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export function middleware(request: NextRequest) {
  const publicPathnameRegex = new RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .map((p) => (p === '/' ? '' : p))
      .join('|')})/?$`,
    'i'
  );

  const isPublicPage = publicPathnameRegex.test(request.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(request);
  } else {
    return (authMiddleware as any)(request as NextRequestWithAuth);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
>>>>>>> a60ce285271f3e1cc6fa1403fb6885b1e5aefa10
};
