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
  
  // Xử lý đặc biệt cho callback Google
  if (pathname === '/auth/callback') {
    console.log('Google callback được phát hiện, chuyển hướng:', pathname);
    
    // Chuyển hướng đến endpoint chính thức của NextAuth
    const url = new URL('/api/auth/callback/google', request.url);
    url.search = request.nextUrl.search;
    
    console.log('Middleware chuyển hướng đến:', url.toString());
    return NextResponse.redirect(url);
  }

  // Bỏ qua các tài nguyên tĩnh và api routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Xác thực với NextAuth
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    // Chuyển hướng người dùng đã đăng nhập từ trang login
    if ((pathname === '/login' || pathname === '/register') && token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Nếu truy cập vào trang cần xác thực nhưng không có token
    const protectedRoutes = ['/account', '/checkout', '/admin'];
    
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error('Lỗi xác thực:', error);
  }

  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các route cần kiểm tra
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/account/:path*',
    '/checkout/:path*',
    '/admin/:path*',
    '/auth/callback',
    '/products/:path*',
    '/services/:path*',
    '/about',
    '/contact',
  ],
} 