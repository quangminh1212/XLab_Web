import { NextRequest, NextResponse } from 'next/server';

function parseAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS || '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getCorsHeaders(req: NextRequest, methods: string[] = ['GET', 'OPTIONS']) {
  const allowed = parseAllowedOrigins();
  const origin = req.headers.get('origin');
  // Chỉ bật CORS nếu origin nằm trong danh sách cho phép
  if (origin && allowed.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      Vary: 'Origin',
      'Access-Control-Allow-Methods': methods.join(','),
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

