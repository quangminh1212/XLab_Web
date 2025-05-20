import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { safeLog } from '@/lib/utils';

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
  '/',
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

// Hàm debug để kiểm tra token và đường dẫn
const debug = (request: NextRequest, token: any) => {
  if (process.env.NODE_ENV === 'development') {
    safeLog.log('[Middleware Debug]:', {
      path: request.nextUrl.pathname,
      token: token ? `Found (${token.email})` : 'Not found',
    });
  }
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Bỏ qua các file static và api routes không cần kiểm tra
  if (
    isStaticFile(pathname) ||
    pathname.startsWith('/api/auth/')
  ) {
    return NextResponse.next();
  }
  
  // Lấy token từ cookie
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "voZ7iiSzvDrGjrG0m0qkkw60XkANsAg9xf/rGiA4bfA=",
  });
  
  // Log thông tin debug
  debug(request, token);
  
  // Nếu là đường dẫn admin
  if (isAdminPath(pathname)) {
    // Nếu chưa đăng nhập, chuyển đến login
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURIComponent(pathname));
      return NextResponse.redirect(url);
    }
    
    // Kiểm tra email có trong danh sách admin không
    if (!token.email || !ADMIN_EMAILS.includes(token.email)) {
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }

    // Cho phép admin truy cập
    return NextResponse.next();
  }
  
  // Nếu là đường dẫn được bảo vệ và chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (isProtectedPath(pathname) && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  // Chỉ áp dụng cho các đường dẫn cần kiểm tra
  matcher: [
    /*
     * Chỉ match các route sau:
     * - /admin (truy cập trang admin)
     * - /admin/:path* (các trang admin)
     * - /account (trang tài khoản người dùng)
     * - /account/:path* (các trang con của account)
     * - /checkout (trang thanh toán)
     * - /checkout/:path* (các trang con của checkout)
     * - /api/protected (các API bảo vệ)
     * - /api/protected/:path* (các API con bảo vệ)
     */
    '/admin',
    '/admin/:path*',
    '/account',
    '/account/:path*',
    '/checkout',
    '/checkout/:path*',
    '/api/protected',
    '/api/protected/:path*'
  ],
}; 