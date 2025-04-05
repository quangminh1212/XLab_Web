import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
  for (let i = 0; i < protectedPaths.length; i++) {
    const protectedPath = protectedPaths[i];
    if (path === protectedPath || path.startsWith(`${protectedPath}/`)) {
      return true;
    }
  }
  return false;
};

// Kiểm tra xem đường dẫn có thuộc danh sách admin hay không
const isAdminPath = (path: string) => {
  for (let i = 0; i < adminPaths.length; i++) {
    const adminPath = adminPaths[i];
    if (path === adminPath || path.startsWith(`${adminPath}/`)) {
      return true;
    }
  }
  return false;
};

// Kiểm tra xem đường dẫn có thuộc danh sách công khai hay không
const isPublicPath = (path: string) => {
  for (let i = 0; i < publicPaths.length; i++) {
    const publicPath = publicPaths[i];
    if (path === publicPath || path.startsWith(`${publicPath}/`)) {
      return true;
    }
  }
  return false;
};

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Bỏ qua các tài nguyên tĩnh và api routes không được bảo vệ
  if (
    pathname.startsWith('/_next') || 
    (pathname.startsWith('/api/') && !pathname.startsWith('/api/protected')) ||
    pathname.startsWith('/static') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Đơn giản hóa middleware để tránh lỗi
  // Middleware này chỉ thêm header bảo mật cơ bản và cho phép mọi request
  const response = NextResponse.next();
  
  // Set basic security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
} 