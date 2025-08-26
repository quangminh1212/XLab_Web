import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

describe('Security middleware', () => {
  const baseUrl = 'https://example.com';

  function makeReq(path: string, method: string, headers: Record<string, string> = {}) {
    const url = new URL(path, baseUrl).toString();
    // @ts-expect-error - constructing NextRequest with custom init in tests
    return new NextRequest(url, { method, headers: new Headers(headers) });
  }

  it('allows safe methods without Origin/Referer', async () => {
    const req = makeReq('/api/products', 'GET');
    const res = await middleware(req as any);
    expect(res.status).toBe(200);
  });

  it('blocks POST without valid Origin/Referer', async () => {
    const req = makeReq('/api/validate-coupon', 'POST');
    const res = await middleware(req as any);
    expect(res.status).toBe(403);
  });

  it('allows POST with matching Origin', async () => {
    const req = makeReq('/api/validate-coupon', 'POST', { Origin: baseUrl });
    const res = await middleware(req as any);
    expect(res.status).toBe(200);
  });
});

