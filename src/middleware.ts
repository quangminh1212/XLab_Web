import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Định nghĩa các loại route
const ROUTES = {
  protected: ['/account', '/checkout', '/api/protected'],
  admin: ['/admin'],
  public: [
    '/login',
    '/register',
    '/about',
    '/products',
    '/accounts',
    '/services',
    '/support',
    '/contact',
    '/api/auth',
    '/',
  ],
  // Các đuôi file tĩnh cần bỏ qua
  staticExtensions: ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.ico', '.webmanifest', '.css', '.js', '.json', '.xml', '.txt'],
  // Các path pattern của file tĩnh
  staticPaths: ['/_next/', '/images/', '/favicon.ico'],
};

// Danh sách email admin (lưu ở một nơi tập trung)
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || ['xlab.rnd@gmail.com'];

// Rate limiting setup
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 100; // 100 requests per minute
const API_RATE_LIMIT = 50; // 50 requests per minute for API calls

// Store IP addresses and their request counts
const requestCounts = new Map<string, { count: number, timestamp: number }>();

/**
 * Kiểm tra xem đường dẫn có thuộc loại được xác định hay không
 * @param path Đường dẫn cần kiểm tra
 * @param routeList Danh sách đường dẫn tham chiếu
 */
const matchesRoute = (path: string, routeList: string[]): boolean => {
  return routeList.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
};

/**
 * Kiểm tra nếu đường dẫn là tệp tĩnh
 * @param path Đường dẫn cần kiểm tra
 */
const isStaticFile = (path: string): boolean => {
  return (
    ROUTES.staticPaths.some(pattern => path.includes(pattern)) ||
    ROUTES.staticExtensions.some(ext => path.endsWith(ext))
  );
};

/**
 * Log thông tin debug (chỉ trong development)
 */
const logDebug = (request: NextRequest, token: any): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware Debug]:', {
      path: request.nextUrl.pathname,
      token: token ? `Found (${token.email})` : 'Not found',
    });
  }
};

/**
 * Kiểm tra quyền admin
 * @param token NextAuth token
 */
const isAdmin = (token: any): boolean => {
  return token?.email && ADMIN_EMAILS.includes(token.email);
};

/**
 * Tạo response chuyển hướng đến trang đăng nhập
 */
const redirectToLogin = (request: NextRequest, callbackPath: string): NextResponse => {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('callbackUrl', callbackPath);
  return NextResponse.redirect(loginUrl);
};

/**
 * Thêm security headers vào response
 */
const addSecurityHeaders = (response: NextResponse): NextResponse => {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://analytics.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';"
  );
  
  // Prevent XSS attacks
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // HTTP Strict Transport Security
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  return response;
};

/**
 * Implement rate limiting
 */
const checkRateLimit = (request: NextRequest): boolean => {
  // Get client IP from the x-forwarded-for header or fallback
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const isApiRequest = request.nextUrl.pathname.startsWith('/api/');
  const maxRequests = isApiRequest ? API_RATE_LIMIT : MAX_REQUESTS_PER_WINDOW;
  
  // Check if IP is in the map
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  const record = requestCounts.get(ip)!;
  
  // Reset if outside window
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  // Increment count and check limit
  record.count++;
  
  // Check if over limit
  if (record.count > maxRequests) {
    return false;
  }
  
  return true;
};

/**
 * Middleware chính để xử lý kiểm tra quyền truy cập
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Bỏ qua các file static và api auth routes không cần kiểm tra
  if (isStaticFile(pathname) || pathname.includes('/api/auth')) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }
  
  // Check rate limiting
  if (!checkRateLimit(request)) {
    const response = new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
    return addSecurityHeaders(response);
  }

  // Lấy token từ cookie với secret từ environment
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build',
  });

  // Log thông tin debug trong môi trường phát triển
  logDebug(request, token);

  // Xử lý đường dẫn admin
  if (matchesRoute(pathname, ROUTES.admin)) {
    // Nếu chưa đăng nhập, chuyển đến login
    if (!token) {
      return redirectToLogin(request, pathname);
    }

    // Kiểm tra có quyền admin không
    if (!isAdmin(token)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Xử lý đường dẫn được bảo vệ
  if (matchesRoute(pathname, ROUTES.protected) && !token) {
    return redirectToLogin(request, pathname);
  }

  // Mọi route khác được xử lý bởi Next.js App Router
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  // Chỉ áp dụng cho các đường dẫn cần kiểm tra
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
