import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

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
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
