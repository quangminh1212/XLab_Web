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

  try {
    // Lấy token xác thực với các tùy chọn chi tiết hơn
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "voZ7iiSzvDrGjrG0m0qkkw60XkANsAg9xf/rGiA4bfA=",
      secureCookie: process.env.NODE_ENV === "production",
      cookieName: process.env.NODE_ENV === "production" 
        ? `__Secure-next-auth.session-token` 
        : `next-auth.session-token`,
    });

    console.log('Middleware executing for path:', pathname);
    console.log('Authentication status:', token ? 'Authenticated' : 'Not authenticated');
    
    if (token) {
      console.log('Token found:', { email: token.email, id: token.sub });
      
      // Người dùng đã đăng nhập, cho phép truy cập các trang được bảo vệ
      if (isProtectedPath(pathname)) {
        console.log('Allowing authenticated user to access protected path:', pathname);
        return NextResponse.next();
      }
      
      // Nếu đường dẫn công khai (login/register) và người dùng đã đăng nhập
      if ((pathname === '/login' || pathname === '/register') && token) {
        console.log('Authenticated user accessing login page, redirecting to home page');
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Kiểm tra quyền admin cho các đường dẫn admin
      if (isAdminPath(pathname)) {
        if (token.email !== 'xlab.rnd@gmail.com') {
          // Nếu đã đăng nhập nhưng không phải email admin, chuyển đến trang chủ
          console.log('Non-admin user trying to access admin area, redirecting to home');
          return NextResponse.redirect(new URL('/', request.url));
        }
        console.log('Admin user accessing admin area, allowing access');
        return NextResponse.next();
      }
    } else {
      // Người dùng chưa đăng nhập
      console.log('User not authenticated');
      
      // Nếu đường dẫn được bảo vệ, chuyển hướng đến trang đăng nhập
      if (isProtectedPath(pathname)) {
        console.log('Unauthenticated user trying to access protected path, redirecting to login');
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', encodeURI(pathname));
        return NextResponse.redirect(url);
      }
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
  } catch (error) {
    // Log lỗi để debug
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
} 