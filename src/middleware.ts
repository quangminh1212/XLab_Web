import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Danh sách các đường dẫn được bảo vệ (yêu cầu đăng nhập)
const protectedPaths = [
  '/account',
  '/checkout',
  '/api/protected',
];

// Danh sách các đường dẫn chỉ dành cho admin
const adminPaths = [
  '/admin',
];

// Danh sách các đường dẫn công khai (không cần đăng nhập)
const publicPaths = [
  '/login',
  '/register',
  '/about',
  '/products',
  '/services',
  '/support',
  '/contact',
  '/api/auth',
];

// Danh sách các ngôn ngữ được hỗ trợ
const locales = ['vi', 'en'];
const defaultLocale = 'vi';

// Kiểm tra xem đường dẫn có thuộc danh sách được bảo vệ hay không
const isProtectedPath = (path: string) => {
  return protectedPaths.some((protectedPath) =>
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  );
};

// Kiểm tra xem đường dẫn có thuộc danh sách admin hay không
const isAdminPath = (path: string) => {
  return adminPaths.some((adminPath) =>
    path === adminPath || path.startsWith(`${adminPath}/`)
  );
};

// Kiểm tra xem đường dẫn có thuộc danh sách công khai hay không
const isPublicPath = (path: string) => {
  return publicPaths.some((publicPath) =>
    path === publicPath || path.startsWith(`${publicPath}/`)
  );
};

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/auth/signin',
  '/auth/signup',
  '/auth/reset-password',
  '/about',
  '/contact',
  '/products',
  '/products/.+',
  '/services',
  '/services/.+',
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bỏ qua các tài nguyên tĩnh và api routes không được bảo vệ
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') && !pathname.startsWith('/api/protected') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Xử lý chuyển đổi ngôn ngữ
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Nếu URL không có mã ngôn ngữ, thêm ngôn ngữ mặc định vào URL
  if (!pathnameHasLocale) {
    // Lấy ngôn ngữ ưu tiên từ cookie hoặc Accept-Language header
    const acceptLanguage = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || '';
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

    // Xác định ngôn ngữ để sử dụng
    let locale = cookieLocale ||
      (acceptLanguage && locales.includes(acceptLanguage) ? acceptLanguage : defaultLocale);

    // Tạo URL mới với ngôn ngữ đã chọn
    const url = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
    url.search = request.nextUrl.search;

    return NextResponse.redirect(url);
  }

  // Lấy token xác thực
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Trích xuất đường dẫn không có locale để kiểm tra quyền truy cập
  const pathWithoutLocale = pathname.split('/').slice(2).join('/');
  const localePath = pathname.split('/')[1];

  // Kiểm tra quyền admin cho các đường dẫn admin
  if (isAdminPath(`/${pathWithoutLocale}`)) {
    if (!token) {
      // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
      const url = new URL(`/${localePath}/login`, request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    } else if (token.email !== 'xlab.rnd@gmail.com') {
      // Nếu đã đăng nhập nhưng không phải email admin, chuyển đến trang chủ
      return NextResponse.redirect(new URL(`/${localePath}`, request.url));
    }
  }

  // Nếu đường dẫn được bảo vệ và người dùng chưa đăng nhập
  if (isProtectedPath(`/${pathWithoutLocale}`) && !token) {
    const url = new URL(`/${localePath}/login`, request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // Nếu đường dẫn công khai (login/register) và người dùng đã đăng nhập
  if ((pathWithoutLocale === 'login' || pathWithoutLocale === 'register') && token) {
    return NextResponse.redirect(new URL(`/${localePath}/account`, request.url));
  }

  // Thêm security headers
  const response = NextResponse.next();

  // CSP Header
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self' https://www.google-analytics.com;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
} 