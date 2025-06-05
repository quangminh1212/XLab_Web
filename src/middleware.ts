<<<<<<< HEAD
import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
=======
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';
import { locales } from '@/i18n/request';
>>>>>>> d3e78d4f978f0864382e8714f0b3ca7c2acb6cd0

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
<<<<<<< HEAD
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
=======
};

// Cấu hình i18n middleware
const i18nMiddleware = createMiddleware({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = request.headers.get('accept-language')?.split(',')?.[0].split('-')[0] || 'vi';
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

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
>>>>>>> d3e78d4f978f0864382e8714f0b3ca7c2acb6cd0
};
