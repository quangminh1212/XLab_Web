import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock next/server with minimal rewrite/next
jest.mock('next/server', () => ({
  NextResponse: {
    rewrite: (url: URL) => ({ kind: 'rewrite', url }),
    next: () => ({ kind: 'next' }),
  },
}));

// Import after mocks
import { middleware } from '../src/middleware';

function makeReq(urlStr: string) {
  const url = new URL(urlStr);
  return {
    url: url.toString(),
    nextUrl: { pathname: url.pathname },
  } as any;
}

describe('middleware i18n rewrite', () => {
  it('rewrites /en/products/... to /products/... with lang=eng (preserve query)', async () => {
    const req = makeReq('https://xlab.vn/en/products/canva?foo=1');
    const res: any = await middleware(req);
    expect(res?.kind).toBe('rewrite');
    expect(res?.url?.pathname).toBe('/products/canva');
    expect(res?.url?.searchParams.get('foo')).toBe('1');
    expect(res?.url?.searchParams.get('lang')).toBe('eng');
  });

  it('rewrites /en to / with lang=eng', async () => {
    const req = makeReq('https://xlab.vn/en');
    const res: any = await middleware(req);
    expect(res?.kind).toBe('rewrite');
    expect(res?.url?.pathname).toBe('/');
    expect(res?.url?.searchParams.get('lang')).toBe('eng');
  });
});

