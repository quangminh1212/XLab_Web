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
  
  // Bỏ qua tất cả các đường dẫn auth và callback để đảm bảo OAuth hoạt động
  if (
    pathname.startsWith('/api/auth') || 
    pathname.includes('/callback') ||
    pathname.includes('oauth') ||
    pathname.includes('/auth') ||
    pathname.includes('/signin') ||
    pathname.includes('/signout')
  ) {
    console.log("Middleware: Bỏ qua đường dẫn OAuth:", pathname);
    return NextResponse.next();
  }
  
  // Bỏ qua tất cả tài nguyên tĩnh
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Lấy token xác thực
  const token = await getToken({
    req: request,
    secret: "121200", // Hardcoded secret
  });

  console.log("Middleware: Kiểm tra đường dẫn:", pathname, "- Token:", !!token);

  // Không chuyển hướng các trang đăng nhập (tạm thời)
  if ((pathname === '/login' || pathname === '/register')) {
    return NextResponse.next();
  }

  // Thêm security headers - bỏ qua CSP
  const response = NextResponse.next();
  return response;
} 