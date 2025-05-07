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
    // Hiện tại cho phép tất cả truy cập để sửa lỗi
    return NextResponse.next();
  } catch (error) {
    // Log lỗi để debug
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
} 