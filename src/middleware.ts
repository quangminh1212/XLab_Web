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
  // Chỉ log khi ở môi trường development và là admin path
  if (process.env.NODE_ENV === 'development' && isAdminPath(request.nextUrl.pathname)) {
    console.log('[Middleware Debug]:', {
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
    pathname.includes('/api/auth')
  ) {
    return NextResponse.next();
  }
  
  // Lấy token từ cookie với secret cố định
  const token = await getToken({
    req: request,
    secret: "voZ7iiSzvDrGjrG0m0qkkw60XkANsAg9xf/rGiA4bfA=",
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
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/checkout/:path*',
    '/api/protected/:path*'
  ],
}; 