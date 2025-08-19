import { NextRequest, NextResponse } from 'next/server';

function parseAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS || '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function matchesOrigin(origin: string, pattern: string): boolean {
  if (!origin || !pattern) return false;
  if (origin === pattern) return true;
  try {
    const o = new URL(origin);
    const p = new URL(pattern.replace('*.', 'subdomain.'));
    // Khi có wildcard, chỉ áp dụng cho phần host bắt đầu bằng '*.'
    const star = pattern.includes('*.');
    if (star) {
      const hostPattern = pattern.split('://')[1];
      if (!hostPattern) return false;
      const hp = hostPattern.replace('*.', '');
      // Yêu cầu cùng protocol nếu pattern nêu rõ
      const protocolOk = pattern.startsWith('http') ? origin.startsWith(pattern.split('://')[0] + '://') : true;
      // host phải kết thúc bằng phần sau '*.'
      const hostOk = o.hostname === hp || o.hostname.endsWith('.' + hp);
      return protocolOk && hostOk;
    }
    // Không wildcard -> so sánh tuyệt đối URL
    return o.origin === p.origin;
  } catch {
    return false;
  }
}

export function getCorsHeaders(req: NextRequest, methods: string[] = ['GET', 'OPTIONS']) {
  const allowed = parseAllowedOrigins();
  const origin = req.headers.get('origin') || '';
  const ok = allowed.some((p) => matchesOrigin(origin, p));
  // Chỉ bật CORS nếu origin nằm trong danh sách cho phép
  if (ok) {
    return {
      'Access-Control-Allow-Origin': origin,
      Vary: 'Origin',
      'Access-Control-Allow-Methods': methods.join(','),
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '600',
      // Tùy chọn bật credentials nếu cần
      // 'Access-Control-Allow-Credentials': 'true',
    } as Record<string, string>;
  }
  return {} as Record<string, string>;
}

export function handleCorsOptions(req: NextRequest, methods: string[] = ['GET', 'OPTIONS']) {
  const headers = getCorsHeaders(req, methods);
  // Nếu không khớp origin thì trả 204 nhưng không set CORS headers (trình duyệt sẽ chặn)
  return new NextResponse(null, { status: 204, headers });
}

