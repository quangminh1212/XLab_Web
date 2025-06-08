import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import i18nConfig from '../next-i18next.config.js';

// Danh sách các đường dẫn được bảo vệ (yêu cầu đăng nhập)
const protectedPaths = ['/account', '/checkout', '/api/protected'];

// Danh sách các đường dẫn chỉ dành cho admin
const adminPaths = ['/admin'];

// Danh sách email admin (giữ đồng bộ với NextAuth)
const ADMIN_EMAILS = ['xlab.rnd@gmail.com'];

export async function middleware(request: NextRequest) {
    // 1. i18n logic
    const { pathname } = request.nextUrl;
    const { locales, defaultLocale } = i18nConfig.i18n;

    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Bỏ qua các file static và assets không cần xử lý locale
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/favicon.ico')
    ) {
        return NextResponse.next();
    }

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = defaultLocale;
        
        return NextResponse.redirect(new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url));
    }

    // 2. Auth logic
    // Get current locale
    const currentLocale = locales.find(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) || defaultLocale;
    
    // Strip locale from pathname for auth checks
    let pathnameWithoutLocale = pathname;
    if (pathname.startsWith(`/${currentLocale}`)) {
        pathnameWithoutLocale = pathname.substring(currentLocale.length + 1);
        if (!pathnameWithoutLocale.startsWith('/')) {
            pathnameWithoutLocale = '/' + pathnameWithoutLocale;
        }
    }
    if (pathnameWithoutLocale === '') pathnameWithoutLocale = '/';

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build',
    });

    const isPathAdmin = adminPaths.some(p => pathnameWithoutLocale.startsWith(p));
    const isPathProtected = protectedPaths.some(p => pathnameWithoutLocale.startsWith(p));

    if (isPathAdmin) {
        if (!token) {
            const url = new URL(`/${currentLocale}/login`, request.url);
            url.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(url);
        }
        if (!token.email || !ADMIN_EMAILS.includes(token.email)) {
            const url = new URL(`/${currentLocale}/`, request.url);
            return NextResponse.redirect(url);
        }
    }

    if (isPathProtected && !token) {
        const url = new URL(`/${currentLocale}/login`, request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
      // Skip all internal paths (_next) and API routes
      '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|sitemap.xml|robots.txt).*)',
    ],
};
