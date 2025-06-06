import { NextRequest, NextResponse } from 'next/server';

export const locales = ['vi', 'en'];
export const defaultLocale = 'vi';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, etc.
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('favicon.ico') ||
    pathname.includes('site.webmanifest')
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
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
  matcher: ['/((?!api|_next/static|_next/image|_next/data|favicon.ico|images|site.webmanifest).*)'],
};
