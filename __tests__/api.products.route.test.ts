import { GET } from '@/app/api/products/route';
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({ json: () => Promise.resolve(body), status: init?.status ?? 200 }),
  },
}));

import type { NextRequest } from 'next/server';
// Ensure global Response exists for completeness (not strictly needed due to mock above)
if (!(global as any).Response) {
  (global as any).Response = function() {} as any;
}

jest.mock('@/lib/i18n/products', () => ({
  getAllProducts: jest.fn(async () => ([
    { id: 'a', slug: 'a', isPublished: true, categories: ['cat1'], versions: [{ price: 200, originalPrice: 300 }], totalSold: 5, createdAt: '2025-01-01T00:00:00Z' },
    { id: 'b', slug: 'b', isPublished: true, categories: ['cat2'], versions: [{ price: 100, originalPrice: 150 }], totalSold: 10, createdAt: '2025-02-01T00:00:00Z' },
    { id: 'c', slug: 'c', isPublished: false, categories: ['cat1'], versions: [{ price: 300, originalPrice: 300 }], totalSold: 2, createdAt: '2024-12-15T00:00:00Z' },
  ])),
}));

function makeReq(url: string, headers: Record<string, string> = {}): NextRequest {
  // @ts-ignore - minimal mock compatible enough for route handler usage
  return { nextUrl: new URL(url, 'http://localhost'), headers: { get: (k: string) => headers[k] || null } } as NextRequest;
}

describe('/api/products route', () => {
  it('applies limit and exclude', async () => {
    const req = makeReq('http://localhost/api/products?limit=1&exclude=b');
    const res = await GET(req as any);
    const data = await (res as any).json();
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(1);
    expect(data.data[0].id).toBe('a');
  });

  it('filters by category', async () => {
    const req = makeReq('http://localhost/api/products?category=cat2');
    const res = await GET(req as any);
    const data = await (res as any).json();
    expect(data.data.length).toBe(1);
    expect(data.data[0].id).toBe('b');
  });

  it('sorts by price-low', async () => {
    const req = makeReq('http://localhost/api/products?sort=price-low');
    const res = await GET(req as any);
    const data = await (res as any).json();
    expect(data.data[0].id).toBe('b'); // price 100 then 200
  });

  it('sorts by popular', async () => {
    const req = makeReq('http://localhost/api/products?sort=popular');
    const res = await GET(req as any);
    const data = await (res as any).json();
    expect(data.data[0].id).toBe('b'); // totalSold 10 highest
  });
});

