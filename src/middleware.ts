import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Các đường dẫn không cần kiểm tra phiên làm việc
const publicPaths = [
  '/login',
  '/register',
  '/about',
  '/products',
  '/services',
  '/support',
  '/contact',
];

// Các đường dẫn cần quyền admin
const adminPaths = [
  '/admin',
];

// Cấu hình matcher của middleware
export const config = {
  matcher: [
    /*
     * Loại trừ tất cả các đường dẫn sau:
     * 1. Các api route
     * 2. Các tệp tĩnh của Next.js /_next
     * 3. Các tệp tĩnh trong /static
     * 4. Các tệp có phần mở rộng (ví dụ: favicon.ico)
     * 5. Các route xác thực của NextAuth
     */
    '/((?!api|_next|static|.*\\..*|auth).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Bỏ qua các route xác thực
  if (
    pathname.includes('/api/auth') ||
    pathname.startsWith('/auth') ||
    pathname.includes('signin') ||
    pathname.includes('signout') ||
    pathname.includes('callback')
  ) {
    return NextResponse.next();
  }
  
  // Luôn cho phép truy cập vào các trang công khai
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  try {
    // Kiểm tra token xác thực
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || '121200',
    });
    
    // Nếu không có token và đường dẫn không phải công khai
    if (!token && !isPublicPath) {
      // Chuyển hướng đến trang đăng nhập
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }
    
    // Kiểm tra quyền admin
    if (adminPaths.some(path => pathname.startsWith(path))) {
      // Kiểm tra nếu người dùng có quyền admin
      const isAdmin = token?.email?.endsWith('@xlab.vn') || false;
      
      if (!isAdmin) {
        // Chuyển hướng về trang chủ nếu không có quyền admin
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Trong trường hợp lỗi, cho phép tiếp tục
    return NextResponse.next();
  }
} 