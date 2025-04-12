import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Các đường dẫn không yêu cầu xác thực
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/about',
  '/contact',
  '/products',
  '/services',
  '/terms',
  '/privacy',
  '/api'
];

// Các đường dẫn chỉ dành cho admin
const adminPaths = [
  '/admin'
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
    // Kiểm tra token xác thực từ NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || '121200',
    });

    // Kiểm tra cookie session tùy chỉnh
    const sessionCookie = request.cookies.get('xlab_session');
    let customSession = null;
    
    if (sessionCookie) {
      try {
        const decodedSession = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
        customSession = JSON.parse(decodedSession);
        console.log("Phát hiện session cookie tùy chỉnh:", customSession?.user?.email);
      } catch (e) {
        console.error("Lỗi khi parse cookie session:", e);
      }
    }
    
    // Cho phép truy cập nếu có token từ NextAuth hoặc session cookie hợp lệ
    if ((token || (customSession && customSession.user)) && !isPublicPath) {
      // Kiểm tra quyền admin cho các đường dẫn admin
      if (adminPaths.some(path => pathname.startsWith(path))) {
        // Kiểm tra quyền admin từ email
        const email = token?.email || customSession?.user?.email || '';
        const isAdmin = email.endsWith('@xlab.vn') || email === 'xlab.rnd@gmail.com';
        
        if (!isAdmin) {
          // Chuyển hướng về trang chủ nếu không có quyền admin
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
      
      return NextResponse.next();
    }
    
    // Nếu không có token/session và đường dẫn không phải công khai
    // Chuyển hướng đến trang đăng nhập
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Middleware error:', error);
    // Trong trường hợp lỗi, cho phép tiếp tục
    return NextResponse.next();
  }
} 