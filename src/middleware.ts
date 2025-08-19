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
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'xlab.rnd@gmail.com')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean);

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
 * Middleware chính để xử lý kiểm tra quyền truy cập
 */
// CSRF: chỉ chấp nhận các request state-changing từ cùng origin
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

function parseAllowedOrigins(): string[] {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function matchesOrigin(origin: string, pattern: string): boolean {
  if (!origin || !pattern) return false;
  if (origin === pattern) return true;
  try {
    const o = new URL(origin);
    const star = pattern.includes('*.');
    if (star) {
      const proto = pattern.split('://')[0] || 'https';
      const hostPattern = pattern.split('://')[1];
      if (!hostPattern) return false;
      const hp = hostPattern.replace('*.', '');
      const protocolOk = origin.startsWith(proto + '://');
      const hostOk = o.hostname === hp || o.hostname.endsWith('.' + hp);
      return protocolOk && hostOk;
    }
    const p = new URL(pattern);
    return o.origin === p.origin;
  } catch {
    return false;
  }
}

function getCorsHeaders(req: NextRequest, methods: string[] = ['GET','POST','PUT','PATCH','DELETE','OPTIONS']): Record<string,string> {
  const allowed = parseAllowedOrigins();
  const origin = req.headers.get('origin') || '';
  const ok = allowed.some((p) => matchesOrigin(origin, p));
  if (!ok) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': methods.join(','),
    'Access-Control-Allow-Headers': req.headers.get('access-control-request-headers') || 'Content-Type, Authorization',
    'Access-Control-Max-Age': '600',
  };
}


function isApiPath(pathname: string) {
  return pathname.startsWith('/api');
}

function isWebhookPath(pathname: string) {
  const raw = process.env.WEBHOOK_PATHS || '';
  const paths = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return paths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function getClientId(req: NextRequest) {
  // Ưu tiên IP thực nếu reverse proxy set X-Forwarded-For
  const fwd = req.headers.get('x-forwarded-for');
  if (typeof fwd === 'string' && fwd.length > 0) {
    const first = fwd.split(',')[0];
    if (first) return first.trim();
  }
  // NextRequest có thể có ip
  // @ts-ignore
  return (req.ip as string) || req.headers.get('x-real-ip') || 'unknown';
}

import { isRateLimitedUpstash } from '@/lib/rateLimit';

async function isRateLimited(req: NextRequest, pathname: string): Promise<boolean> {
  const key = `${getClientId(req)}::${pathname.startsWith('/api/admin') ? 'admin' : 'api'}`;
  const limited = await isRateLimitedUpstash(key, pathname.startsWith('/api/admin'));
  return limited;
}

function isCsrfValid(req: NextRequest): boolean {
  const method = req.method.toUpperCase();
  if (SAFE_METHODS.includes(method)) return true;
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const selfOrigin = new URL(req.url).origin;
  if (origin) return origin === selfOrigin;
  if (referer) return referer.startsWith(selfOrigin + '/');
  // Không có Origin/Referer -> coi là không hợp lệ để an toàn
  return false;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Bỏ qua các file static
  if (isStaticFile(pathname)) {
    return NextResponse.next();
  }

  // Rate limit & CSRF + CORS cho API
  let corsHeadersToSet: Record<string,string> | null = null;
  if (isApiPath(pathname)) {
    // Preflight CORS
    if (request.method.toUpperCase() === 'OPTIONS') {
      const headers = getCorsHeaders(request);
      return new NextResponse(null, { status: 204, headers });
    }

    // Bypass cho webhook paths (sẽ xác thực chữ ký tại route)
    if (isWebhookPath(pathname)) {
      return NextResponse.next();
    }

    if (await isRateLimited(request, pathname)) {
      return new NextResponse('Too Many Requests', { status: 429, headers: { 'Retry-After': '60', ...getCorsHeaders(request) } });
    }
    // Bỏ qua CSRF cho NextAuth routes vì đã có bảo vệ nội bộ
    if (!pathname.startsWith('/api/auth')) {
      if (!isCsrfValid(request)) {
        return new NextResponse('Forbidden (CSRF)', { status: 403 });
      }
    }

    // Chuẩn bị set CORS headers cho phản hồi API
    const h = getCorsHeaders(request);
    if (Object.keys(h).length > 0) corsHeadersToSet = h;
  }

  // Rewrite i18n subpath /en/* -> /* with ?lang=eng (preserve existing query)
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = new URL(request.url);
    const newPath = pathname.replace(/^\/en(\/|$)/, '/');
    url.pathname = newPath === '' ? '/' : newPath;
    if (url.searchParams.get('lang') !== 'eng') {
      url.searchParams.set('lang', 'eng');
    }
    return NextResponse.rewrite(url);
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
  const res = NextResponse.next();
  if (corsHeadersToSet) {
    Object.entries(corsHeadersToSet).forEach(([k,v]) => res.headers.set(k, v));
  }
  return res;
}

export const config = {
  // Áp dụng cho admin, các trang bảo vệ và toàn bộ API (trừ file tĩnh đã được loại ở trên)
  matcher: ['/admin/:path*', '/account/:path*', '/checkout/:path*', '/api/:path*'],
};
