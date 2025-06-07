import { NextRequest, NextResponse } from 'next/server';

export const locales = ['vi', 'en'];
export const defaultLocale = 'vi';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, etc.
 if (
   pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/) ||
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
    // Nếu đường dẫn đã có locale, lưu locale đó vào cookie và tiếp tục
    const currentLocale = pathname.split('/')[1];
    const response = NextResponse.next();
    
    // Lưu locale vào cookie
    response.cookies.set('NEXT_LOCALE', currentLocale, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    
    return response;
  }

  // Get preferred locale from cookie or accept-language header
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  let locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;
  
  if (!cookieLocale) {
    // If no cookie, try to get locale from accept-language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      const preferredLocale = acceptLanguage
        .split(',')
        .map((lang) => {
          const [code] = lang.split(';')[0].trim().split('-');
          return code.toLowerCase();
        })
        .find((lang) => locales.includes(lang));
      
      if (preferredLocale) {
        locale = preferredLocale;
      }
    }
  }

  // Redirect to the locale path
  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  
  // Set locale cookie in the response
  const response = NextResponse.redirect(url);
  response.cookies.set('NEXT_LOCALE', locale, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
  
  return response;
}

export const config = {
 matcher: ['/((?!_next|api|favicon.ico|site.webmanifest|.*\\.).*)'],
};
