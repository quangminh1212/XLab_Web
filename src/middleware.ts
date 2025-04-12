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

export const config = {
  matcher: [
    /*
     * Khớp với tất cả các đường dẫn ngoại trừ:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /_static (typically static files)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml (thường là static files)
     * 6. Bất kỳ tệp tĩnh nào có phần mở rộng
     */
    '/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml|.*\\..*|auth).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Kiểm tra xem đường dẫn có phải là tệp tĩnh không
  if (
    pathname.includes('.') || // Có phần mở rộng tệp
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') ||
    pathname.includes('favicon')
  ) {
    return NextResponse.next();
  }
  
  // Bỏ qua tất cả các đường dẫn auth và callback để đảm bảo OAuth hoạt động
  if (
    pathname.startsWith('/api/auth') || 
    pathname.includes('/callback') ||
    pathname.includes('oauth') ||
    pathname.includes('/auth') ||
    pathname.includes('/signin') ||
    pathname.includes('/signout')
  ) {
    return NextResponse.next();
  }

  try {
    // Lấy token xác thực
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Chuyển hướng trang admin nếu không phải admin
    if (isAdminPath(pathname)) {
      if (!token) {
        // Nếu không có token, chuyển hướng đến trang đăng nhập
        return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
      }
      
      // Kiểm tra quyền admin (thêm logic tùy theo cách xác định admin trong hệ thống)
      const isAdmin = token?.email?.endsWith('@xlab.vn') || false;
      
      if (!isAdmin) {
        // Nếu không phải admin, chuyển hướng đến trang chủ
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Chuyển hướng các trang được bảo vệ nếu chưa đăng nhập
    if (isProtectedPath(pathname) && !token) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
    }

    // Thêm security headers
    const response = NextResponse.next();
    
    // Thêm các headers bảo mật
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
} 