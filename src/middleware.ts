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

// Hàm debug để kiểm tra token và đường dẫn
const debug = (request: NextRequest, token: any) => {
  if (process.env.NODE_ENV === 'development') {
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
    pathname.includes('/_next') ||
    pathname.includes('/api/auth') ||
    pathname.includes('/images') ||
    pathname.includes('/favicon.ico')
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
    
    // Nếu không phải admin email, chuyển đến trang chủ
    if (token.email !== 'xlab.rnd@gmail.com') {
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 