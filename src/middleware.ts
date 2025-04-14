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
  '/',
  '/login',
  '/register',
  '/about',
  '/products',
  '/services',
  '/support',
  '/contact',
  '/api/auth',
  '/auth',
  '/pricing',
  '/privacy',
  '/terms',
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

// Kiểm tra xem đường dẫn có phải là tài nguyên tĩnh hay không
const isStaticAsset = (path: string) => {
  return (
    path.startsWith('/_next') || 
    path.startsWith('/__nextjs') || 
    path.startsWith('/static') || 
    path.includes('.') ||
    path === '/favicon.ico'
  );
};

export const config = {
  matcher: [
    // Bỏ qua các route tĩnh như hình ảnh, assets và API chứng thực
    '/((?!_next/static|_next/image|api/auth|favicon.ico).*)',
  ],
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Bỏ qua các tài nguyên tĩnh và api routes không được bảo vệ
  if (
    isStaticAsset(pathname) || 
    (pathname.startsWith('/api/') && !pathname.startsWith('/api/protected'))
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

    // Thêm security headers
    const response = NextResponse.next();
    
    // CSP Header - cấu hình rộng hơn để tránh lỗi
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googleapis.com https://*.gstatic.com https://*.googletagmanager.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: blob:;
      font-src 'self' data: https://fonts.gstatic.com;
      connect-src 'self' https://*.google-analytics.com https://*.googleapis.com;
      frame-src 'self' https://*.google.com accounts.google.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', cspHeader);
    
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // Nếu xảy ra lỗi, vẫn cho phép tiếp tục
    return NextResponse.next();
  }
} 