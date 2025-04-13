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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Debug
  console.log('Middleware xử lý đường dẫn:', pathname);

  // Xử lý đường dẫn callback từ Google OAuth - xử lý trước bất kỳ phần nào khác
  if (pathname === '/auth/callback') {
    // Tạo URL mới chuyển hướng đến endpoint chính thức của NextAuth
    const url = new URL('/api/auth/callback/google', request.url);
    
    // Sao chép tất cả các query params bằng cách lấy chuỗi search
    url.search = request.nextUrl.search;
    
    console.log('Middleware chuyển hướng đến:', url.toString());
    
    // Chuyển hướng đến endpoint chính thức của NextAuth
    return NextResponse.redirect(url);
  }

  // Bỏ qua các tài nguyên tĩnh và api routes không được bảo vệ
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/') && !pathname.startsWith('/api/protected') ||
    pathname.startsWith('/static') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Lấy token xác thực
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Kiểm tra quyền admin cho các đường dẫn admin
    if (isAdminPath(pathname)) {
      if (!token) {
        // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', encodeURI(pathname));
        return NextResponse.redirect(url);
      } else if (token.email !== 'xlab.rnd@gmail.com') {
        // Nếu đã đăng nhập nhưng không phải email admin, chuyển đến trang chủ
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Nếu đường dẫn được bảo vệ và người dùng chưa đăng nhập
    if (isProtectedPath(pathname) && !token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    // Nếu đường dẫn công khai (login/register) và người dùng đã đăng nhập
    if ((pathname === '/login' || pathname === '/register') && token) {
      return NextResponse.redirect(new URL('/account', request.url));
    }
  } catch (error) {
    console.error('Lỗi xác thực trong middleware:', error);
    // Nếu lỗi xác thực, để người dùng tiếp tục
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
    frame-src 'self' accounts.google.com;
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

// Chỉ áp dụng middleware cho các đường dẫn xác thực và cơ bản
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)',
    '/auth/callback',
    '/auth/signin/:path*',
    '/auth/error'
  ],
} 